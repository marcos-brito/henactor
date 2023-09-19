#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;

fn main() {
    config::default::generate_default_config();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::default::generate_default_config,
            config::default::get_theme_file,
            config::default::get_fonts_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
