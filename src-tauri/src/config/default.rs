use super::ConfigGenerator;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Serialize, Deserialize)]
struct Colors {
    red: String,
    blue: String,
    green: String,
    yellow: String,
    purple: String,
}

#[derive(Serialize, Deserialize)]
struct PinnedItem {
    name: String,
    path: String,
    icon: String,
}

#[derive(Serialize, Deserialize)]
pub struct Pallete {
    background_dark: String,
    background_light: String,
    highlight: String,
    text_dark: String,
    text_light: String,
    accent: String,
    colors: Colors,
}

#[derive(Serialize, Deserialize)]
pub struct Fonts {
    font: String,
    small_text: String,
    regular_text: String,
    big_text: String,
    regular_title: String,
    big_title: String,
}

#[derive(Serialize, Deserialize)]
pub struct Pinned {
    items: Vec<PinnedItem>,
}

// WARN: Tauri cannot interact with methods. All we got are
// functions. Using a global we can share data between
// then more easily. If you have a better ideia refactor please.
lazy_static! {
    static ref CONFIG: ConfigGenerator = ConfigGenerator::new("henactor");
}

#[tauri::command]
pub fn generate_default_config() -> () {
    let default_colors = Colors {
        red: "#eb564e".to_string(),
        blue: "#458588".to_string(),
        green: "#689d6a".to_string(),
        yellow: "#e78a4e".to_string(),
        purple: "#b16286".to_string(),
    };

    let default_theme = Pallete {
        background_dark: "#1e1e1e".to_string(),
        background_light: "#202020".to_string(),
        highlight: "#3f3f3f".to_string(),
        text_dark: "#ddc7a1".to_string(),
        text_light: "#808480".to_string(),
        accent: "#689d6a".to_string(),
        colors: default_colors,
    };

    let default_fonts = Fonts {
        font: "JetBrains Mono".to_string(),
        small_text: ".75rem".to_string(),
        regular_text: "1rem".to_string(),
        big_text: "1.25rem".to_string(),
        regular_title: "2rem".to_string(),
        big_title: "2.5rem".to_string(),
    };

    CONFIG.create_config_dir();
    CONFIG.add_config_file("theme.json", &default_theme);
    CONFIG.add_config_file("fonts.json", &default_fonts);
}

//TODO: Error handling
#[tauri::command]
pub fn get_theme_file() -> Pallete {
    let path = CONFIG
        .base_dirs
        .config_dir()
        .join(CONFIG.config_dir.as_str())
        .join("theme.json");

    let file_content = fs::read_to_string(path).unwrap();
    let theme: Pallete = serde_json::from_str(file_content.as_str()).unwrap();

    theme
}

//TODO: Error handling
#[tauri::command]
pub fn get_fonts_file() -> Fonts {
    let path = CONFIG
        .base_dirs
        .config_dir()
        .join(CONFIG.config_dir.as_str())
        .join("fonts.json");

    let file_content = fs::read_to_string(path).unwrap();
    let fonts: Fonts = serde_json::from_str(file_content.as_str()).unwrap();

    fonts
}
