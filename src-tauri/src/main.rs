#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod file_system;
mod pins;
mod utils;

pub struct ConfigPath(String);

use config::{default::DefaultConfig, ConfigGenerator};

fn main() {
    let config_generator = ConfigGenerator::new("henactor");
    let default_config = DefaultConfig::new(&config_generator);

    config_generator.create_config_dir();
    default_config.generate();

    tauri::Builder::default()
        .manage(ConfigPath(
            config_generator
                .config_dir_path
                .to_string_lossy()
                .to_string(),
        ))
        .invoke_handler(tauri::generate_handler![
            file_system::directory::get_dir_entries,
            config::commands::get_theme_file,
            config::commands::get_icons_file,
            pins::get_pinned_items,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
