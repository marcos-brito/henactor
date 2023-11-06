pub mod directory;
mod error;

use error::Error;
use serde::Serialize;
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
    created: Option<SystemTime>,
    modified: Option<SystemTime>,
    content_type: FileSystemEntryType,
}

impl FileSystemEntry {
    pub fn new(path: &str) -> FileSystemEntry {
        let metadata = fs::metadata(path).unwrap();
        let path = Path::new(path);

        FileSystemEntry {
            name: Path::file_name(path).unwrap().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            created: metadata.created().ok(),
            modified: metadata.modified().ok(),
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
pub fn path_exists(path: &str) -> bool {
    let path = Path::new(path);

    Path::exists(path)
}

#[tauri::command]
pub fn get_path_childrens(path: &str) -> Result<Vec<FileSystemEntry>, Error> {
    let path = Path::new(path);
    let childrens: Vec<FileSystemEntry> = fs::read_dir(path)
        .map_err(|_| Error::ReadingError {
            path: path.to_string_lossy().to_string(),
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

#[tauri::command]
pub fn get_path_files(path: &str) -> Result<Vec<FileSystemEntry>, Error> {
    let path = Path::new(path);
    let childrens: Vec<FileSystemEntry> = fs::read_dir(path)
        .map_err(|_| Error::ReadingError {
            path: path.to_string_lossy().to_string(),
        })?
        .filter_map(|child| {
            let child = child.ok()?;

            if child.file_type().ok()?.is_file() {
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
    use crate::utils;
    use std::error::Error;
    use tempfile::tempdir;

    #[test]
    fn test_get_childrens() -> Result<(), Box<dyn Error>> {
        let temp_dir = tempdir()?;
        let temp_dir_path = temp_dir.path();

        fs::create_dir(temp_dir_path.join("dir1"))?;
        fs::create_dir(temp_dir_path.join("dir2"))?;
        fs::File::create(temp_dir_path.join("file1"))?;
        fs::File::create(temp_dir_path.join("file2"))?;

        let dir_object1 = FileSystemEntry::new(temp_dir_path.join("dir1").to_str().unwrap());
        let dir_object2 = FileSystemEntry::new(temp_dir_path.join("dir2").to_str().unwrap());

        let expected = vec![dir_object1, dir_object2];
        let actual = get_path_childrens(temp_dir_path.to_str().unwrap())?;

        assert!(utils::vec_holds_another(&expected, &actual));
        temp_dir.close()?;

        Ok(())
    }

    #[test]
    fn test_get_childrens_should_fail() -> Result<(), Box<dyn Error>> {
        let path = String::from("./test");
        let expected = Err(error::Error::ReadingError { path });
        let actual = get_path_childrens("./test");

        assert_eq!(expected, actual);
        Ok(())
    }
}
