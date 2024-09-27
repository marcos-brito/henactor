pub mod config;
use serde::Serialize;
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};
type Result<T> = std::result::Result<T, Error>;
#[derive(Debug, thiserror::Error, specta::Type)]
pub enum Error {
    #[error("")]
    Io(
        #[serde(skip)]
        #[from]
        std::io::Error,
    ),
    #[error("")]
    Config(
        #[serde(skip)]
        #[from]
        confy::ConfyError,
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

pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            config::find_themes,
            config::save_config,
            config::load_config,
        ])
        .error_handling(ErrorHandlingMode::Throw);
    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");
    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
