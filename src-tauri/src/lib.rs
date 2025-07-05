pub mod cache;
pub mod config;
pub mod fs;
pub mod open;
pub mod task;

use notify::RecommendedWatcher;
use serde::ser::{Serialize, SerializeSeq};
use specta_typescript::{BigIntExportBehavior, Typescript};
use std::sync::Mutex;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};

type Result<T> = std::result::Result<T, Error>;

#[derive(thiserror::Error, Debug, specta::Type)]
pub enum Error {
    #[specta(skip)]
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[specta(skip)]
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error(transparent)]
    #[specta(skip)]
    Tauri(#[from] tauri::Error),
    #[error(transparent)]
    #[specta(skip)]
    Notify(#[from] notify::Error),
    #[error(transparent)]
    #[specta(skip)]
    SerializeError(#[from] toml::ser::Error),
    #[error(transparent)]
    #[specta(skip)]
    DeserializeError(#[from] toml::de::Error),
    #[error(transparent)]
    #[specta(skip)]
    Trash(#[from] trash::Error),
    #[error("unable to send data. Task was either finished or killed")]
    TaskSendError,
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let causes = collect_sources(self);
        let mut seq = serializer.serialize_seq(Some(1 + causes.len()))?;

        for cause in causes {
            seq.serialize_element(&cause)?;
        }

        seq.end()
    }
}

pub fn collect_sources(err: &(dyn std::error::Error + 'static)) -> Vec<String> {
    let mut sources = Vec::new();
    let mut current = Some(err);

    while let Some(e) = current {
        sources.push(e.to_string());
        current = e.source();
    }

    sources
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
            fs::query::matches,
            fs::query::search,
            open::open,
            open::open_with,
            open::find_openers,
            cache::download_or_find
        ])
        .events(collect_events![fs::watch::WatchEvent, task::TaskEvent])
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
