pub mod cache;
pub mod config;
pub mod fs;

use notify::RecommendedWatcher;
use serde::Serialize;
use specta_typescript::Typescript;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error, specta::Type)]
pub enum Error {
    #[error("")]
    Watch(
        #[serde(skip)]
        #[from]
        notify::Error,
    ),
    #[error("")]
    Io(
        #[serde(skip)]
        #[from]
        std::io::Error,
    ),
    #[error("")]
    ReadConfig(
        #[serde(skip)]
        #[from]
        toml::ser::Error,
    ),
    #[error("")]
    WriteCofig(
        #[serde(skip)]
        #[from]
        toml::de::Error,
    ),
    #[error("")]
    Config(
        #[serde(skip)]
        #[from]
        confy::ConfyError,
    ),
    #[error("")]
    Req(
        #[serde(skip)]
        #[from]
        reqwest::Error,
    ),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
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
            fs::watch,
            fs::read_file
            cache::download_or_find
        ])
        .events(collect_events![fs::WatchEvent])
        .error_handling(ErrorHandlingMode::Throw);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
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
