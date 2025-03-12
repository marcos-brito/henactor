use crate::Result;
use anyhow::Context;
use log::error;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Opener {
    name: String,
    icon: PathBuf,
}

#[tauri::command]
#[specta::specta]
pub fn open(path: PathBuf) -> Result<()> {
    open::that_detached(&path)
        .with_context(|| format!("Failed to open {}", path.display()))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn open_with(path: PathBuf, cmd: String) -> Result<()> {
    open::with_detached(&path, &cmd)
        .with_context(|| format!("Failed to open {} with {}", path.display(), cmd))
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn find_openers(path: PathBuf) -> Vec<Opener> {
    vec![]
}
