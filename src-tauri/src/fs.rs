use super::{AppState, Result};
use anyhow::Context;
use fs_extra::dir;
use log::{error, warn};
use notify::{recommended_watcher, EventKind, RecursiveMode, Watcher};
use rand::random;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, State};
use std::time::SystemTime;
use tauri_specta::Event;

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct WatchEvent(String);

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

#[derive(Serialize, Deserialize, Type)]
pub enum EntryType {
    Directory,
    File,
    Symlink,
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
pub fn watch(app: AppHandle, state: State<AppState>, path: PathBuf) -> Result<u32> {
    let id = random::<u32>();

    let mut watcher = recommended_watcher(move |res| match res {
        Ok(event) => {
            if should_emit(&event) {
                if let Err(e) = WatchEvent(format!("watch::{id}")).emit(&app) {
                    warn!("Failed to emit watch event: {e}")
                }
            }
        } // what should we do with this?
        Err(_) => (),
    })
    .with_context(|| "Could not create fs watcher")?;

    watcher
        .watch(&path, RecursiveMode::Recursive)
        .with_context(|| format!("Failed to watch {}", path.display()))?;

    state.watchers.lock().unwrap().insert(id, watcher);

    Ok(id)
}

fn should_emit(event: &notify::Event) -> bool {
    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_) => true,
        _ => false,
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
