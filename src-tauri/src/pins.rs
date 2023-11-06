use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

use crate::ConfigPath;

#[derive(Serialize, Deserialize)]
pub struct PinnedItem {
    name: String,
    path: String,
    icon: String,
}

impl PinnedItem {
    pub fn new(name: &str, path: &str, icon: &str) -> Self {
        Self {
            name: name.to_string(),
            path: path.to_string(),
            icon: icon.to_string(),
        }
    }
}

#[tauri::command]
pub fn get_pinned_items(config_path: tauri::State<ConfigPath>) -> Vec<PinnedItem> {
    let file_name = "pins.json";
    let path = Path::new(&config_path.inner().0).join(file_name);
    let file_content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(_) => panic!("Could not read pinned items"),
    };

    let pins: Vec<PinnedItem> = serde_json::from_str(&file_content).unwrap();

    pins
}

// #[tauri::command]
// pub fn new_pin(configPath: &tauri::State<ConfigPath>, name: String, path: String, icon: String) {
//     let pin = PinnedItem::new(&name, &path, &icon);
// }
