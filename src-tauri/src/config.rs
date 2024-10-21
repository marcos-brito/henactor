use super::Result;
use log::warn;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

pub const OPTIONS_FILE: &str = "options.toml";
pub const PINS_FILE: &str = "pins.toml";
pub const TABS_FILE: &str = "tabs.toml";
pub const KEYBINDS_FILE: &str = "keys.toml";
pub const THEMES_DIR: &str = "themes";
pub const THEME_FILE: &str = "theme.css";
pub const ICONS_FILE: &str = "icons.toml";

#[derive(Debug, Hash, PartialEq, Eq, Serialize, Deserialize, Type)]
pub enum Command {
    HalfPageUp,
    HalfPageDown,
    Down,
    Up,
    Left,
    Right,
    Confirm,
    FocusSidebar,
    FocusTabs,
    FocusExplorer,
    OpenDetails,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct KeyBindings(HashMap<Command, Vec<String>>);

impl Default for KeyBindings {
    fn default() -> Self {
        KeyBindings(HashMap::from([
        ]))
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Pin {
    alias: String,
    target: PathBuf,
    icon: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Type, PartialEq, Eq, Hash)]
pub struct Tab {
    name: String,
    path: PathBuf,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Icons {
    sort: Option<String>,
    filter: Option<String>,
    directory: Option<String>,
    x: Option<String>,
    plus: Option<String>,
    file: Option<String>,
    search: Option<String>,
    grid_view: Option<String>,
    list_view: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Theme {
    name: String,
    path: PathBuf,
    css_file: PathBuf,
    icons: Option<Icons>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Options {
    title: String,
    download_icons: bool,
    auto_reload: bool,
    save_on_change: bool,
    current_theme: String,
    lang: String,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            title: "Henactor".to_string(),
            download_icons: true,
            save_on_change: false,
            auto_reload: true,
            key_interval: 200,
            current_theme: "default".to_string(),
            lang: "en".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Config {
    options: Options,
    keybinds: KeyBindings,
    tabs: Vec<Tab>,
    themes: Vec<Theme>,
    pins: Vec<Pin>,
}

impl Default for Config {
    fn default() -> Self {
        let pins = directories::BaseDirs::new()
            .and_then(|dirs| {
                Some(vec![Pin {
                    alias: dirs
                        .home_dir()
                        .file_name()
                        .and_then(|name| Some(name.to_string_lossy().to_string()))
                        .unwrap_or("Home".to_string()),
                    target: dirs.home_dir().to_path_buf(),
                    icon: Some("🏠".to_string()),
                }])
            })
            .unwrap_or(vec![]);

        Config {
            options: Options::default(),
            keybinds: KeyBindings::default(),
            themes: vec![],
            tabs: vec![],
            pins,
        }
    }
}

#[tauri::command]
#[specta::specta]
pub fn default_config() -> Config {
    Config::default()
}

#[tauri::command]
#[specta::specta]
pub fn load_config(config_dir: PathBuf) -> Result<Config> {
    Ok(Config {
        themes: find_themes(&config_dir),
        options: read_config_file(config_dir.join(OPTIONS_FILE))?,
        pins: read_config_file(config_dir.join(PINS_FILE))?,
        tabs: read_config_file(config_dir.join(TABS_FILE))?,
        keybinds: read_config_file(config_dir.join(KEYBINDS_FILE))?,
    })
}

#[tauri::command]
#[specta::specta]
pub fn save_config(config_dir: PathBuf, config: Config) -> Result<()> {
    write_config_file(config.options, config_dir.join(OPTIONS_FILE))?;
    write_config_file(config.keybinds, config_dir.join(KEYBINDS_FILE))?;
    write_config_file(config.tabs, config_dir.join(TABS_FILE))?;
    write_config_file(config.pins, config_dir.join(PINS_FILE))?;
    Ok(())
}

pub fn find_themes(config_dir: &PathBuf) -> Vec<Theme> {
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
            let icons = fs::read_to_string(entry.path().join(ICONS_FILE))
                .ok()
                .and_then(|content| toml::from_str::<Icons>(&content).ok());

            if css_file.exists() {
                return Some(Theme {
                    name: entry.file_name().to_string_lossy().to_string(),
                    path: entry.path(),
                    icons,
                    css_file,
                });
            }

            warn!(
                "No css file found for theme \"{}\"",
                entry.file_name().to_string_lossy().to_string()
            );
            None
        })
        .collect::<Vec<Theme>>()
}

pub fn write_config_file<T>(config: T, path: PathBuf) -> Result<()>
where
    T: Serialize,
{
    let content = toml::to_string(&config)?;
    Ok(fs::write(&path, content)?)
}

pub fn read_config_file<T>(path: PathBuf) -> Result<T>
where
    T: serde::de::DeserializeOwned,
{
    let content = fs::read_to_string(&path)?;
    Ok(toml::from_str::<T>(&content)?)
}
