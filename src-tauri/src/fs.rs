pub mod filter;
pub mod sort;
pub mod watch;

use crate::Result;
use anyhow::Context;
use log::{error, info, warn};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;
use std::time::SystemTime;

#[derive(Serialize, Deserialize, Type)]
pub struct Entry {
    name: String,
    path: PathBuf,
    entry_type: EntryType,
    details: EntryDetails,
}

impl TryFrom<&fs::DirEntry> for Entry {
    type Error = anyhow::Error;

    fn try_from(entry: &fs::DirEntry) -> std::result::Result<Self, Self::Error> {
        Ok(Self {
            name: entry.file_name().to_string_lossy().to_string(),
            path: entry.path(),
            entry_type: entry
                .file_type()
                .map(|file_type| file_type.into())
                .with_context(|| {
                    format!("Failed to get file type of {}", entry.path().display())
                })?,
            details: entry.metadata().map(|metadata| metadata.into())?,
        })
    }
}

impl TryFrom<PathBuf> for Entry {
    type Error = anyhow::Error;

    fn try_from(path: PathBuf) -> std::result::Result<Self, Self::Error> {
        let metadata = path
            .metadata()
            .with_context(|| format!("Failed to get metadata of {}", path.display()))?;

        Ok(Self {
            name: path
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .with_context(|| format!("Failed to get file name for {}", path.display()))?,
            entry_type: metadata.file_type().into(),
            details: metadata.into(),
            path,
        })
    }
}

#[derive(Serialize, Deserialize, Type)]
pub struct EntryDetails {
    created: Option<SystemTime>,
    accessed: Option<SystemTime>,
    modified: Option<SystemTime>,
    permissions: Option<Permissions>,
    size: u64,
}

impl From<fs::Metadata> for EntryDetails {
    fn from(metadata: fs::Metadata) -> Self {
        Self {
            created: metadata.created().ok(),
            accessed: metadata.accessed().ok(),
            modified: metadata.modified().ok(),
            permissions: None,
            size: metadata.len(),
        }
    }
}

#[derive(Serialize, Deserialize, Type)]
pub struct Permissions {}

#[derive(Serialize, Deserialize, Type, Clone, PartialOrd, Ord, PartialEq, Eq, Debug)]
pub enum EntryType {
    Directory,
    File,
    Symlink,
}

impl std::fmt::Display for EntryType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Directory => write!(f, "directory"),
            Self::File => write!(f, "file"),
            Self::Symlink => write!(f, "link"),
        }
    }
}

impl From<fs::FileType> for EntryType {
    fn from(file_type: fs::FileType) -> Self {
        if file_type.is_dir() {
            return EntryType::Directory;
        }

        if file_type.is_symlink() {
            return EntryType::Symlink;
        }

        EntryType::File
    }
}

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
