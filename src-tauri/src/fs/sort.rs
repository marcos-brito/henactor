use crate::fs::Entry;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::cmp::Ordering;
use std::time::SystemTime;

#[derive(Serialize, Deserialize, Debug, Type, Clone, PartialEq, Eq)]
pub enum SortMethod {
    Name,
    Size,
    Kind,
    DetailedKind,
    Accessed,
    Created,
    Modified,
}

pub fn cmp_by(a: &Entry, b: &Entry, method: &SortMethod) -> Ordering {
    match method {
        SortMethod::Name => a.name().cmp(b.name()),
        SortMethod::Size => a.size().cmp(&b.size()),
        SortMethod::Created => cmp_systime(a.created_at(), b.created_at()),
        SortMethod::Accessed => cmp_systime(a.accessed_at(), b.accessed_at()),
        SortMethod::Modified => cmp_systime(a.modified_at(), b.modified_at()),
        SortMethod::Kind => a.kind().cmp(b.kind()),
        SortMethod::DetailedKind => match (a.mime(), b.mime()) {
            (Some(a), Some(b)) => a.cmp(&b),
            _ => a.kind().cmp(b.kind()),
        },
    }
}

fn cmp_systime(a: Option<SystemTime>, b: Option<SystemTime>) -> Ordering {
    a.unwrap_or(SystemTime::now())
        .cmp(&b.unwrap_or(SystemTime::now()))
}

#[tauri::command]
#[specta::specta]
pub fn sort(mut entries: Vec<Entry>, method: SortMethod) -> Vec<Entry> {
    entries.sort_by(|a, b| cmp_by(&a, &b, &method));

    entries
}
