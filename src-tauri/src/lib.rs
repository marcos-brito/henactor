pub mod cache;
pub mod config;
pub mod fs;
pub mod open;

use notify::RecommendedWatcher;
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::{BigIntExportBehavior, Typescript};
use std::sync::Mutex;
use tauri_specta::Event;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct TaskKillEvent(u32);

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Type, Serialize)]
pub struct Error {
    err: String,
    causes: Vec<String>,
}

impl std::error::Error for Error {}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:#}", self)
    }
}

// This actually makes required to return anyhow::Error from any command. First I thought
// it was bad. Now I think it might be good because we want to allow users to see the error details
// in the UI and without anyhow's context they would get less useful. For now i'm keeping it.
impl From<anyhow::Error> for Error {
    fn from(value: anyhow::Error) -> Self {
        Self {
            err: value.to_string(),
            causes: value.chain().map(|err| err.to_string()).collect(),
        }
    }
}

pub struct AppState {
    watcher: Mutex<Option<RecommendedWatcher>>,
}

pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            config::load_config,
            config::save_config,
            config::default_config,
            config::find_themes,
            fs::watch::watch,
            fs::watch::unwatch,
            fs::list,
            fs::exists,
            fs::rename,
            fs::remove,
            fs::trash,
            fs::restore_trashed,
            fs::create_link,
            fs::create_dir,
            fs::create_file,
            fs::find_link_target,
            fs::sort::sort,
            fs::filter::filter,
            fs::filter::search,
            open::open,
            open::open_with,
            open::find_openers,
            cache::download_or_find
        ])
        .events(collect_events![fs::watch::WatchEvent, TaskKillEvent])
        .error_handling(ErrorHandlingMode::Throw);

    #[cfg(debug_assertions)]
    builder
        .export(
            // Do we mind if it's lossy?
            Typescript::default().bigint(BigIntExportBehavior::Number),
            "../src/lib/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(builder.invoke_handler())
        .manage(AppState {
            watcher: Mutex::new(None),
        })
        .setup(move |app| {
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
