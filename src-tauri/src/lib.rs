use specta_typescript::Typescript;
use tauri_specta::{collect_commands, collect_events, Builder, ErrorHandlingMode};
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
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
