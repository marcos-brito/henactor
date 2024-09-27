use super::Result;
use directories::UserDirs;
use log::warn;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;

const CONFIG_FILE: &str = "henactor.toml";
const THEMES_DIR: &str = "themes";
const THEME_FILE: &str = "theme.css";

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Pin {
    alias: String,
    target: PathBuf,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Tab {
    name: String,
    dir: PathBuf,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Theme {
    name: String,
    css: PathBuf,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Config {
    title: String,
    save_on_change: bool,
    current_theme: String,
    pins: Vec<Pin>,
    tabs: Vec<Pin>,
}

impl Default for Config {
    fn default() -> Self {
        let pins = match UserDirs::new() {
            Some(dirs) => {
                vec![Pin {
                    alias: dirs
                        .home_dir()
                        .file_name()
                        .and_then(|name| Some(name.to_string_lossy().to_string()))
                        .unwrap_or("Home".to_string()),
                    target: dirs.home_dir().to_path_buf(),
                }]
            }
            None => vec![],
        };

        Config {
            title: "Henactor".to_string(),
            save_on_change: false,
            current_theme: "default".to_string(),
            pins,
            tabs: vec![],
        }
    }
}

#[tauri::command]
#[specta::specta]
pub fn find_themes(config_dir: PathBuf) -> Vec<Theme> {
    let entries = match fs::read_dir(config_dir.join(THEMES_DIR)) {
        Ok(entries) => entries,
        Err(err) => {
            warn!("Failed to read {}. No themes will be loaded", err);
            return vec![];
        }
    };

    entries
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let css_file = entry.path().join(THEME_FILE);

            if css_file.exists() {
                return Some(Theme {
                    name: entry.file_name().to_string_lossy().to_string(),
                    css: css_file,
                });
            }

            None
        })
        .collect::<Vec<Theme>>()
}

#[tauri::command]
#[specta::specta]
pub fn save_config(config_dir: PathBuf, config: Config) -> Result<()> {
    Ok(confy::store_path(config_dir.join(CONFIG_FILE), config)?)
}

#[tauri::command]
#[specta::specta]
pub fn load_config(config_dir: PathBuf) -> Config {
    match confy::load_path(&config_dir.join(CONFIG_FILE)) {
        Ok(config) => config,
        Err(e) => {
            warn!(
                "Failed to load config from {}: {e}. Using default.",
                config_dir.display()
            );

            Config::default()
        }
    }
}
