use crate::fs::Entry;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::time::SystemTime;

#[derive(Serialize, Deserialize, Debug, Type, Clone, PartialEq, Eq)]
pub enum SortMethod {
    Name,
    Size,
    Kind,
    Natural,
    Accessed,
    Created,
    Modified,
}

#[tauri::command]
#[specta::specta]
pub fn sort(mut entries: Vec<Entry>, method: SortMethod) -> Vec<Entry> {
    match method {
        SortMethod::Name => entries.sort_by_key(|entry| entry.name.clone()),
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
        SortMethod::Natural => (),
    }

    entries
}
