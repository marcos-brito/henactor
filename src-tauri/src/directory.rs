mod error;

use error::Error;
use serde::Serialize;
use std::fs;
use std::os::unix;
use std::path::Path;

#[derive(Serialize, Debug, PartialEq)]
pub struct Directory {
    name: String,
    path: String,
}

#[derive(Serialize, Debug, PartialEq)]
enum DirectoryContentType {
    Directory,
    File,
    Link,
}

#[derive(Serialize, Debug, PartialEq)]
pub struct DirectoryContent {
    name: String,
    path: String,
    content_type: DirectoryContentType,
}

impl DirectoryContent {
    fn new(name: &str, path: &str, content_type: DirectoryContentType) -> DirectoryContent {
        DirectoryContent {
            name: name.to_string().clone(),
            path: path.to_string().clone(),
            content_type,
        }
    }
}

impl Directory {
    fn new(name: &str, path: &str) -> Directory {
        Directory {
            name: name.to_string().clone(),
            path: path.to_string().clone(),
        }
    }
}

fn get_content_type(file: fs::FileType) -> Option<DirectoryContentType> {
    if file.is_file() {
        return Some(DirectoryContentType::File);
    }
    if file.is_dir() {
        return Some(DirectoryContentType::Directory);
    }
    if file.is_symlink() {
        return Some(DirectoryContentType::Link);
    }
    None
}

#[tauri::command]
pub fn get_content(path: &str) -> Result<Vec<DirectoryContent>, Error> {
    let content: Vec<DirectoryContent> = fs::read_dir(Path::new(path))
        .map_err(|_| Error::ReadingError {
            path: path.to_string().to_owned(),
        })?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let file_type = get_content_type(entry.file_type().ok()?)?;
            let file_name = entry.file_name();
            let file_path = entry.path();

            match file_type {
                DirectoryContentType::Directory => Some(DirectoryContent::new(
                    file_name.to_str()?,
                    file_path.to_str()?,
                    DirectoryContentType::Directory,
                )),
                DirectoryContentType::File => Some(DirectoryContent::new(
                    file_name.to_str()?,
                    file_path.to_str()?,
                    DirectoryContentType::File,
                )),
                DirectoryContentType::Link => Some(DirectoryContent::new(
                    file_name.to_str()?,
                    file_path.to_str()?,
                    DirectoryContentType::Link,
                )),
            }
        })
        .collect();

    Ok(content)
}

#[tauri::command]
pub fn get_childrens(path: &str) -> Result<Vec<Directory>, Error> {
    let childrens: Vec<Directory> = fs::read_dir(Path::new(path))
        .map_err(|_| Error::ReadingError {
            path: path.to_string().to_owned(),
        })?
        .filter_map(|child| {
            let child = child.ok()?;

            if child.file_type().ok()?.is_dir() {
                let dir_name = child.file_name().to_str()?.to_owned();
                let dir_path = child.path().to_str()?.to_owned();
                let dir = Directory::new(&dir_name, &dir_path);

                Some(dir)
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
    use std::path::Path;

    #[test]
    fn test_get_childrens() -> Result<(), Box<dyn Error>> {
        fs::create_dir("./test")?;
        fs::create_dir("./test/dir1")?;
        fs::create_dir("./test/dir2")?;

        let dir1 = Directory::new("dir1", "./test/dir1");
        let dir2 = Directory::new("dir2", "./test/dir2");

        let expected = vec![dir1, dir2];
        let actual = get_childrens("./test")?;

        assert_eq!(expected, actual);
        fs::remove_dir_all("./test").unwrap();
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
        fs::create_dir("./test2")?;
        fs::create_dir("./test2/dir1")?;
        fs::File::create("./test2/file1")?;
        unix::fs::symlink("./test2/file1", "./test2/link")?;

        let content1 =
            DirectoryContent::new("dir1", "./test2/dir1", DirectoryContentType::Directory);
        let content2 = DirectoryContent::new("file1", "./test2/file1", DirectoryContentType::File);
        let content3 = DirectoryContent::new("link", "./test2/link", DirectoryContentType::Link);

        let expected = vec![content1, content2, content3];
        let actual = get_content("./test2")?;

        assert_eq!(expected, actual);
        fs::remove_dir_all("./test2").unwrap();
        Ok(())
    }
}
