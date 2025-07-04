use crate::{Result, TaskKillEvent};
use anyhow::Context;
use serde::Serialize;
use specta::Type;
use crate::fs::entry::Entry;
use std::path::PathBuf;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tauri::{ipc::Channel, AppHandle, Listener};
use tauri_specta::Event;
use walkdir::WalkDir;

mod ast;
mod eval;
mod parser;

#[derive(Clone, Serialize, Type)]
#[serde(tag = "event", content = "data")]
pub enum SearchEvent {
    Started(u32),
    Progress(Entry),
    Finished,
}

#[tauri::command]
#[specta::specta]
pub fn filter(entries: Vec<Entry>, filter: String) -> Result<Vec<Entry>> {
    Ok(parser::parse(&filter)
        .map(|pairs| parser::convert(pairs))
        .map(|expr| {
            entries
                .into_iter()
                // TODO: Not clone. Changing the Visitor should allow to pass a reference
                .filter(|entry| eval::eval(&entry, expr.clone()).unwrap_or(false))
                .collect()
        })?)
}

#[tauri::command]
#[specta::specta]
pub async fn search(
    app: AppHandle,
    path: PathBuf,
    query: String,
    on_event: Channel<SearchEvent>,
) -> Result<()> {
    let expr = parser::parse(&query).map(|pairs| parser::convert(pairs))?;
    let task_id = rand::random::<u32>();
    let should_stop = Arc::new(AtomicBool::new(false));
    let should_stop_c = Arc::clone(&should_stop);

    on_event
        .send(SearchEvent::Started(task_id.clone()))
        .with_context(|| "Failed to emit start event")?;

    TaskKillEvent::listen(&app, move |event| {
        if event.payload.0 == task_id {
            should_stop_c.store(true, Ordering::Relaxed);
        }
    });

    for entry in WalkDir::new(&path).into_iter().filter_map(|e| {
        e.ok()
            .and_then(|e| Entry::try_from(e.path().to_path_buf()).ok())
            .and_then(|e| eval::eval(&e, expr.clone()).ok().map(|r| r.then_some(e)))
    }) {
        if should_stop.load(Ordering::Relaxed) {
            break;
        }

        if let Some(e) = entry {
            let _ = on_event.send(SearchEvent::Progress(e));
        }
    }

    on_event
        .send(SearchEvent::Finished)
        .with_context(|| "Failed to emit finished event")?;

    Ok(())
}
