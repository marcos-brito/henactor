use crate::{AppState, Result};
use log::warn;
use notify::{recommended_watcher, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use tauri::{AppHandle, State};
use tauri_specta::Event;

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct WatchEvent(String);

fn create_watcher(app: AppHandle) -> Result<RecommendedWatcher> {
    let watcher = recommended_watcher(move |res| match res {
        Ok(event) => {
            if should_emit(&event) {
                for path in event.paths {
                    if let Err(e) = WatchEvent(format!("{}", path.display())).emit(&app) {
                        warn!("failed to emit watch event: {e}")
                    }
                }
            }
        }
        Err(e) => warn!("watch error: {e}"),
    })?;

    Ok(watcher)
}

fn should_emit(event: &notify::Event) -> bool {
    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_) => true,
        _ => false,
    }
}

#[tauri::command]
#[specta::specta]
pub fn watch(app: AppHandle, state: State<AppState>, path: PathBuf, recursive: bool) -> Result<()> {
    let mut watcher = state.watcher.lock().unwrap();

    if watcher.is_none() {
        *watcher = Some(create_watcher(app)?);
    }

    if let Some(watcher) = watcher.as_mut() {
        watcher.watch(
            &path,
            match recursive {
                true => RecursiveMode::Recursive,
                false => RecursiveMode::NonRecursive,
            },
        )?;
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn unwatch(_app: AppHandle, state: State<AppState>, path: PathBuf) -> Result<()> {
    let mut watcher = state.watcher.lock().unwrap();

    if let Some(watcher) = watcher.as_mut() {
        watcher.unwatch(&path)?;
    }

    Ok(())
}
