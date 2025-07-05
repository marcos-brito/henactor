pub mod entry;
pub mod query;
pub mod sort;
pub mod watch;

use crate::task::{Message, TaskHandle};
use crate::Result;
use entry::Entry;
use log::warn;
use std::fs;
use std::path::PathBuf;
use tauri::{ipc::Channel, AppHandle};

#[tauri::command]
#[specta::specta]
pub async fn list(app: AppHandle, path: PathBuf, on_event: Channel<Message<Entry>>) -> Result<()> {
    let mut handle = TaskHandle::new(app, on_event);
    handle.start()?;

    for entry in fs::read_dir(&path)? {
        match entry.as_ref().map(Entry::from) {
            Ok(entry) => handle.send(entry)?,
            Err(e) => warn!("skipping entry from {}: {}", path.display(), e),
        }
    }

    handle.finish()?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn find_link_target(path: PathBuf) -> Result<Entry> {
    let entry = fs::read_link(&path).map(Entry::from)?;

    Ok(entry)
}

#[tauri::command]
#[specta::specta]
pub fn exists(path: PathBuf) -> bool {
    path.exists()
}

#[cfg(unix)]
#[tauri::command]
#[specta::specta]
pub fn create_link(original: PathBuf, link: PathBuf) -> Result<()> {
    std::os::unix::fs::symlink(&original, &link)?;

    Ok(())
}

#[cfg(windows)]
#[tauri::command]
#[specta::specta]
pub fn create_link(original: PathBuf, link: PathBuf) -> Result<()> {
    match original.is_file() {
        true => std::os::windows::fs::symlink_file(&original, &link),
        false => std::os::windows::fs::symlink_dir(&original, &link),
    }?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn create_file(path: PathBuf) -> Result<()> {
    fs::write(&path, "")?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn create_dir(path: PathBuf) -> Result<()> {
    fs::create_dir_all(&path)?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn rename(from: PathBuf, to: PathBuf) -> Result<()> {
    fs::rename(&from, &to)?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn remove(to_remove: PathBuf) -> Result<()> {
    match to_remove.is_file() {
        true => fs::remove_file(&to_remove),
        false => fs::remove_dir_all(&to_remove),
    }?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn trash(path: PathBuf) -> Result<()> {
    trash::delete(&path)?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn restore_trashed(path: PathBuf) -> Result<()> {
    trash::os_limited::list()
        .map(|items| items.into_iter().find(|item| item.original_path() == path))
        .and_then(|item| match item {
            Some(item) => trash::os_limited::restore_all(vec![item]),
            None => Ok(()),
        })?;

    Ok(())
}
