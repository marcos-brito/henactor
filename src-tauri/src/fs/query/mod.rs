use crate::fs::entry::Entry;
use crate::task::{Message, TaskHandle};
use crate::Result;
use log::warn;
pub use parser::Rule;
use std::path::PathBuf;
use tauri::{ipc::Channel, AppHandle};
use walkdir::WalkDir;

mod ast;
mod eval;
mod parser;

#[tauri::command]
#[specta::specta]
pub fn matches(entry: Entry, query: String) -> Result<bool> {
    Ok(parser::parse(&query)
        .map(|pairs| parser::convert(pairs))
        .and_then(|expr| eval::eval(&entry, expr))?)
}

#[tauri::command]
#[specta::specta]
pub async fn search(
    app: AppHandle,
    path: PathBuf,
    query: String,
    on_event: Channel<Message<Entry>>,
) -> Result<()> {
    let mut handle = TaskHandle::new(app, on_event);
    handle.start()?;

    let expr = parser::parse(&query).map(|pairs| parser::convert(pairs))?;
    for entry in WalkDir::new(&path) {
        match entry.map(|e| Entry::from(e.path().to_path_buf())) {
            Ok(entry) => {
                if eval::eval(&entry, expr.clone())? {
                    handle.send(entry)?;
                }
            }
            Err(e) => warn!("skipping entry from {}: {}", path.display(), e),
        }
    }

    handle.finish()?;

    Ok(())
}
