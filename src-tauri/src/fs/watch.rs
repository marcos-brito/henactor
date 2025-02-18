use crate::{AppState, Result};
use anyhow::Context;
use log::warn;
use notify::{recommended_watcher, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use tauri::{AppHandle, State};
use tauri_specta::Event;

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct WatchEvent(String);

fn create_watcher(app: AppHandle) -> anyhow::Result<RecommendedWatcher> {
    Ok(recommended_watcher(move |res| match res {
        Ok(event) => {
            if should_emit(&event) {
                for path in event.paths {
                    if let Err(e) = WatchEvent(format!("watch::{}", path.display())).emit(&app) {
                        warn!("Failed to emit watch event: {e}")
                    }
                }
            }
        } // what should we do with this?
        Err(_) => (),
    })?)
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

    watcher
        .as_mut()
        .unwrap()
        .watch(
            &path,
            match recursive {
                true => RecursiveMode::Recursive,
                false => RecursiveMode::NonRecursive,
            },
        )
        .with_context(|| format!("Failed to watch {}", path.display()))?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn unwatch(_app: AppHandle, state: State<AppState>, path: PathBuf) -> () {
    let mut watcher = state.watcher.lock().unwrap();

    watcher
        .as_mut()
        .and_then(|watcher| watcher.unwatch(&path).ok());
}
