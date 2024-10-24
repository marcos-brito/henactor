use super::{AppState, Result};
use log::warn;
use notify::{recommended_watcher, RecursiveMode, Watcher};
use rand::random;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use tauri::{AppHandle, State};
use tauri_specta::Event;

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct WatchEvent(String);

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
