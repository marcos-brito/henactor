pub mod filter;
pub mod entry;
pub mod sort;
pub mod watch;

use crate::Result;
use anyhow::Context;
use entry::Entry;
use log::{error, info, warn};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
#[specta::specta]
pub fn list(path: PathBuf) -> Result<Vec<Entry>> {
    Ok(fs::read_dir(&path)
        .with_context(|| format!("Failed to read {}", path.display()))?
        .filter_map(|dir_entry| {
            // Should this be handled?
            let dir_entry = dir_entry.ok()?;

            Entry::try_from(&dir_entry)
                .or_else(|err| {
                    warn!("Skipping {}. Reason: {}", dir_entry.path().display(), err);
                    Err(err)
                })
                .ok()
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub fn find_link_target(path: PathBuf) -> Result<Entry> {
    fs::read_link(&path)
        .with_context(|| format!("Failed to get the target for the link {}", path.display()))
        .and_then(|target| target.try_into())
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
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
    std::os::unix::fs::symlink(&original, &link)
        .with_context(|| format!("Failed to create {}", link.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
        .inspect(|_| {
            info!(
                "Created link from {} to {}",
                original.display(),
                link.display()
            );
        })
}

#[cfg(windows)]
#[tauri::command]
#[specta::specta]
pub fn create_link(original: PathBuf, link: PathBuf) -> Result<()> {
    match original.is_file() {
        true => std::os::windows::fs::symlink_file(&original, &link),
        false => std::os::windows::fs::symlink_dir(&original, &link),
    }
    .with_context(|| format!("Failed to create {}", link.display()))
    .or_else(|err| {
        error!("{err}");
        Err(err.into())
    })
    .inspect(|_| {
        info!(
            "Created link from {} to {}",
            original.display(),
            link.display()
        );
    })
}

#[tauri::command]
#[specta::specta]
pub fn create_file(path: PathBuf) -> Result<()> {
    fs::write(&path, "")
        .with_context(|| format!("Failed to create {}", path.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn create_dir(path: PathBuf) -> Result<()> {
    fs::create_dir_all(&path)
        .with_context(|| format!("Failed to create {}", path.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn rename(from: PathBuf, to: PathBuf) -> Result<()> {
    fs::rename(&from, &to)
        .with_context(|| format!("Failed to rename {} to {}", from.display(), to.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn remove(to_remove: PathBuf) -> Result<()> {
    match to_remove.is_file() {
        true => fs::remove_file(&to_remove),
        false => fs::remove_dir_all(&to_remove),
    }
    .with_context(|| format!("Failed to remove {}", to_remove.display()))
    .or_else(|err| {
        error!("{err}");
        Err(err.into())
    })
}

#[tauri::command]
#[specta::specta]
pub fn trash(path: PathBuf) -> Result<()> {
    trash::delete(&path)
        .with_context(|| format!("Failed to send {} to trash bin", path.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn restore_trashed(path: PathBuf) -> Result<()> {
    trash::os_limited::list()
        .map(|items| items.into_iter().find(|item| item.original_path() == path))
        .and_then(|item| match item {
            Some(item) => trash::os_limited::restore_all(vec![item]),
            None => Ok(()),
        })
        .with_context(|| format!("Failed to restore trashed item {}", path.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}
