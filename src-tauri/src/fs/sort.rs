use crate::fs::Entry;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use std::time::SystemTime;

#[derive(Serialize, Deserialize, Debug, Type, Clone, PartialEq, Eq)]
pub enum SortMethod {
    Name,
    Size,
    Kind,
    DetailedKind,
    Natural,
    Accessed,
    Created,
    Modified,
}

#[tauri::command]
#[specta::specta]
pub fn sort(mut entries: Vec<Entry>, method: SortMethod) -> Vec<Entry> {
    match method {
        SortMethod::Name => entries.sort_by_key(|entry| entry.name.to_lowercase().clone()),
        SortMethod::Size => {
            entries.sort_by_key(|entry| entry.details.size);
            entries.reverse();
        }
        SortMethod::Accessed => {
            entries.sort_by_key(|entry| entry.details.accessed.unwrap_or(SystemTime::now()));
            entries.reverse();
        }
        SortMethod::Created => {
            entries.sort_by_key(|entry| entry.details.created.unwrap_or(SystemTime::now()));
            entries.reverse();
        }
        SortMethod::Modified => {
            entries.sort_by_key(|entry| entry.details.modified.unwrap_or(SystemTime::now()));
            entries.reverse();
        }
        SortMethod::Kind => entries.sort_by_key(|entry| entry.entry_type.clone()),
        SortMethod::DetailedKind => {
            entries.sort_by(|a, b| match (mime_of(&a.path), mime_of(&b.path)) {
                (Some(x), Some(y)) => x.cmp(&y),
                _ => a.entry_type.cmp(&b.entry_type),
            })
        }
        SortMethod::Natural => (),
    }

    entries
}

fn mime_of(path: &PathBuf) -> Option<mime_guess::Mime> {
    mime_guess::from_path(path).first()
}
