mod error;

use error::Error;
use serde::Serialize;
use std::ffi::OsString;
use std::fs;
use std::path::Path;
use std::time::SystemTime;

#[derive(Serialize, Debug, PartialEq)]
enum FileSystemEntryType {
    Directory,
    File,
    Link,
}

#[derive(Serialize, Debug, PartialEq)]
pub struct FileSystemEntry {
    name: String,
    path: String,
    created: SystemTime,
    modified: SystemTime,
    content_type: FileSystemEntryType,
}

impl FileSystemEntry {
    pub fn new(path: &str) -> FileSystemEntry {
        let metadata = fs::metadata(path).unwrap();
        let path = Path::new(path);
        FileSystemEntry {
            name: Path::file_name(path).unwrap().to_string_lossy().to_string(),
            path: path.to_path_buf().into_os_string().into_string().unwrap(),
            created: metadata.created().unwrap(),
            modified: metadata.modified().unwrap(),
            content_type: Self::get_content_type(metadata.file_type()).unwrap(),
        }
    }

    fn get_content_type(file: fs::FileType) -> Option<FileSystemEntryType> {
        if file.is_file() {
            return Some(FileSystemEntryType::File);
        }
        if file.is_dir() {
            return Some(FileSystemEntryType::Directory);
        }
        if file.is_symlink() {
            return Some(FileSystemEntryType::Link);
        }
        None
    }
}

#[tauri::command]
pub fn get_content(path: &str) -> Result<Vec<FileSystemEntry>, Error> {
    let content: Vec<FileSystemEntry> = fs::read_dir(Path::new(path))
        .map_err(|_| Error::ReadingError {
            path: path.to_string().to_owned(),
        })?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            Some(FileSystemEntry::new(entry.path().to_str()?))
        })
        .collect();

    Ok(content)
}

#[tauri::command]
pub fn get_childrens(path: &str) -> Result<Vec<FileSystemEntry>, Error> {
    let childrens: Vec<FileSystemEntry> = fs::read_dir(Path::new(path))
        .map_err(|_| Error::ReadingError {
            path: path.to_string().to_owned(),
        })?
        .filter_map(|child| {
            let child = child.ok()?;

            if child.file_type().ok()?.is_dir() {
                Some(FileSystemEntry::new(child.path().to_str()?))
            } else {
                None
            }
        })
        .collect();

    Ok(childrens)
}

#[cfg(test)]
mod test {
    use super::*;
    use std::error::Error;
    use std::os::unix;
    use std::path::Path;
    use tempfile::tempdir;

    // This is done because the order of some "expected" is different from the "actual"
    fn vec_holds_another<T>(holder: &Vec<T>, sub: &Vec<T>) -> bool
    where
        T: PartialEq,
    {
        for item in sub {
            if !holder.contains(item) {
                return false;
            }
        }
        true
    }

    #[test]
    fn test_get_childrens() -> Result<(), Box<dyn Error>> {
        let dir = tempdir()?;
        let dir_path = dir.path();
        fs::create_dir(dir_path.join("dir1"))?;
        fs::create_dir(dir_path.join("dir2"))?;
        fs::File::create(dir_path.join("file1"))?;
        fs::File::create(dir_path.join("file2"))?;

        let dir1 = FileSystemEntry::new(dir_path.join("dir1").to_str().unwrap());
        let dir2 = FileSystemEntry::new(dir_path.join("dir2").to_str().unwrap());

        let expected = vec![dir1, dir2];
        let actual = get_childrens(dir_path.to_str().unwrap())?;

        assert!(vec_holds_another(&expected, &actual));
        dir.close()?;

        Ok(())
    }

    #[test]
    fn test_get_childrens_should_fail() -> Result<(), Box<dyn Error>> {
        let path = String::from("./test");
        let expected = Err(error::Error::ReadingError { path });
        let actual = get_childrens("./test");

        assert_eq!(expected, actual);
        Ok(())
    }

    #[test]
    fn test_get_content() -> Result<(), Box<dyn Error>> {
        let dir = tempdir()?;
        let dir_path = dir.path();
        fs::create_dir(dir_path.join("dir1"))?;
        fs::File::create(dir_path.join("file1"))?;
        unix::fs::symlink(dir_path.join("file1"), dir_path.join("link"))?;

        let content1 = FileSystemEntry::new(dir_path.join("dir1").to_str().unwrap());
        let content2 = FileSystemEntry::new(dir_path.join("file1").to_str().unwrap());
        let content3 = FileSystemEntry::new(dir_path.join("link").to_str().unwrap());

        let expected = vec![content1, content2, content3];
        let actual = get_content(dir_path.to_str().unwrap())?;

        assert!(vec_holds_another(&expected, &actual));
        dir.close()?;

        Ok(())
    }
}
