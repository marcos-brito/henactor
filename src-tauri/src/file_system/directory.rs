use super::error::Error;
use super::FileSystemEntry;
use std::fs;
use std::path::Path;

#[tauri::command]
pub fn get_dir_entries(path: &str) -> Result<Vec<FileSystemEntry>, Error> {
    let path = Path::new(path);
    let content: Vec<FileSystemEntry> = fs::read_dir(path)
        .map_err(|_| Error::ReadingError {
            path: path.to_string_lossy().to_string(),
        })?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            Some(FileSystemEntry::new(entry.path().to_str()?))
        })
        .collect();

    Ok(content)
}

#[tauri::command]
pub fn create_dir_recursively(path: &str) -> Result<(), Error> {
    let path = Path::new(path);

    match fs::create_dir_all(path) {
        Ok(()) => Ok(()),
        Err(_) => Err(Error::AlreadyExists {
            path: path.to_string_lossy().to_string(),
        }),
    }
}

#[tauri::command]
pub fn remove_dir_recursively(path: &str) -> Result<(), Error> {
    let path = Path::new(path);

    match fs::remove_dir_all(path) {
        Ok(()) => Ok(()),
        Err(_) => Err(Error::DoesNotExits {
            path: path.to_string_lossy().to_string(),
        }),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::utils;
    use std::error::Error;
    use std::os::unix;
    use tempfile::tempdir;

    #[test]
    fn test_get_dir_entries() -> Result<(), Box<dyn Error>> {
        let temp_dir = tempdir()?;
        let temp_dir_path = temp_dir.path();

        fs::create_dir(temp_dir_path.join("dir1"))?;
        fs::File::create(temp_dir_path.join("file1"))?;
        unix::fs::symlink(temp_dir_path.join("file1"), temp_dir_path.join("link"))?;

        let content1 = FileSystemEntry::new(temp_dir_path.join("dir1").to_str().unwrap());
        let content2 = FileSystemEntry::new(temp_dir_path.join("file1").to_str().unwrap());
        let content3 = FileSystemEntry::new(temp_dir_path.join("link").to_str().unwrap());

        let expected = vec![content1, content2, content3];
        let actual = get_dir_entries(temp_dir_path.to_str().unwrap())?;

        assert!(utils::vec_holds_another(&expected, &actual));
        temp_dir.close()?;

        Ok(())
    }

    #[test]
    fn test_create_dir_recursively() -> Result<(), Box<dyn Error>> {
        let temp_dir = tempdir()?;
        let temp_dir_path = temp_dir.path();
        let path_to_create = temp_dir_path.join("dir1/dir2/dir3");

        create_dir_recursively(path_to_create.to_str().unwrap())?;

        assert!(Path::exists(&path_to_create));

        Ok(())
    }

    #[test]
    fn test_create_remove_recursively() -> Result<(), Box<dyn Error>> {
        let temp_dir = tempdir()?;
        let temp_dir_path = temp_dir.path();
        let childrens = temp_dir_path.join("dir1/dir2/dir3");

        fs::create_dir_all(&childrens)?;

        remove_dir_recursively(temp_dir_path.to_str().unwrap())?;

        assert!(!Path::exists(&childrens));

        Ok(())
    }
}
