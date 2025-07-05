use crate::Result;
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
    open::that_detached(&path)?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn open_with(path: PathBuf, cmd: String) -> Result<()> {
    open::with_detached(&path, &cmd)?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn find_openers(path: PathBuf) -> Vec<Opener> {
    vec![]
}
