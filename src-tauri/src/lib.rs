pub mod cache;
pub mod config;
pub mod fs;

use notify::RecommendedWatcher;
use serde::Serialize;
use specta_typescript::Typescript;
use specta_typescript::{BigIntExportBehavior, Typescript};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, specta::Type, Serialize)]
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
    watchers: Mutex<HashMap<u32, RecommendedWatcher>>,
}

pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            config::load_config,
            config::save_config,
            config::default_config,
            config::find_themes,
            fs::watch,
            fs::list,
            fs::find_link_target,
            cache::download_or_find
        ])
        .events(collect_events![fs::WatchEvent])
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
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(builder.invoke_handler())
        .manage(AppState {
            watchers: Mutex::new(HashMap::new()),
        })
        .setup(move |app| {
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
