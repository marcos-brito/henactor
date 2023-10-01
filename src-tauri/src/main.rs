#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod directory;

fn main() {
    config::default::generate_default_config();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config::default::generate_default_config,
            config::default::get_theme_file,
            config::default::get_fonts_file,
            config::default::get_icons_file,
            directory::get_content,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
