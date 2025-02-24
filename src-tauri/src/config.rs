use super::Result;
use crate::fs::sort::SortMethod;
use anyhow::Context;
use log::{error, warn};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

pub const CONFIG_FILE: &str = "henactor.toml";
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
    NextTab,
    PreviousTab,
    NewTab,
    CloseTab,
    QuitKeyGrabber,
    Delete,
    Rename,
    GotoParent,
    Accept,
    Create,
    Open,
    OpenDetails,
    OpenConfig,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct KeyBindings(HashMap<Command, Vec<String>>);

impl Default for KeyBindings {
    fn default() -> Self {
        KeyBindings(HashMap::from([
            (Command::Confirm, vec!["Enter".to_string()]),
            (Command::HalfPageUp, vec!["Control+u".to_string()]),
            (Command::HalfPageDown, vec!["Control+d".to_string()]),
            (Command::Up, vec!["k".to_string(), "ArrowUp".to_string()]),
            (Command::FocusSidebar, vec!["Control+h".to_string()]),
            (Command::Rename, vec!["c+c".to_string()]),
            (Command::Accept, vec!["Enter".to_string()]),
            (Command::Create, vec!["o".to_string()]),
            (Command::OpenDetails, vec!["i".to_string()]),
            (Command::OpenConfig, vec!["Control+o".to_string()]),
            (Command::QuitKeyGrabber, vec!["Control+Enter".to_string()]),
            (Command::CloseTab, vec!["Control+w".to_string()]),
            (Command::NewTab, vec!["Control+t".to_string()]),
            (Command::NextTab, vec!["Shift+K".to_string()]),
            (Command::PreviousTab, vec!["Shift+J".to_string()]),
            (
                Command::Delete,
                vec!["Delete".to_string(), "d+d".to_string()],
            ),
            (
                Command::Down,
                vec!["j".to_string(), "ArrowDown".to_string()],
            ),
            (
                Command::Left,
                vec!["h".to_string(), "ArrowLeft".to_string()],
            ),
            (
                Command::Right,
                vec!["l".to_string(), "ArrowRight".to_string()],
            ),
        ]))
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Pin {
    alias: String,
    target: PathBuf,
    icon: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Type, PartialEq, Eq)]
pub struct Tab {
    name: String,
    path: PathBuf,
    view: View,
    grid_size: u8,
    list_columns: Vec<ListColumn>,
<<<<<<< HEAD
    sort_by: SortMethod,
    filter: String,
=======
<<<<<<< HEAD
=======
    sort_by: SortMethod,
    filter: String,
>>>>>>> 7430e4c (fixup! feat: create some sorting mechanism)
>>>>>>> 0b63c4b (feat: create some sorting mechanism)
    query: String,
}

impl Default for Tab {
    fn default() -> Self {
        Self {
            name: "New".to_string(),
            path: directories::UserDirs::new()
                .map(|dirs| dirs.home_dir().to_path_buf())
                .unwrap_or(PathBuf::from("")),
            view: View::Grid,
            grid_size: 4,
            list_columns: vec![],
<<<<<<< HEAD
            sort_by: SortMethod::Natural,
            filter: "".to_string(),
=======
<<<<<<< HEAD
=======
            sort_by: SortMethod::Natural,
            filter: "".to_string(),
>>>>>>> 7430e4c (fixup! feat: create some sorting mechanism)
>>>>>>> 0b63c4b (feat: create some sorting mechanism)
            query: "".to_string(),
        }
    }
}

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize, Type)]
pub enum ListColumn {
    Kind,
    Created,
    Modified,
    Accessed,
    Size,
    DetailedKind,
}

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize, Type)]
pub enum View {
    Grid,
    List,
    Tree,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Icons {
    sort: Option<String>,
    filter: Option<String>,
    directory: Option<String>,
    file: Option<String>,
    link_to_dir: Option<String>,
    link_to_file: Option<String>,
    x: Option<String>,
    plus: Option<String>,
    search: Option<String>,
    grid_view: Option<String>,
    list_view: Option<String>,
    tree_view: Option<String>,
    empty_dir: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct IconsFile {
    ui: Option<Icons>,
    rules: Option<HashMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Theme {
    name: String,
    path: PathBuf,
    css_file: PathBuf,
    icons: Option<IconsFile>,
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Options {
    title: String,
    download_icons: bool,
    auto_reload: bool,
    current_theme: String,
    key_interval: u8,
    lang: String,
    truncation_limit: u8,
    default_tab: Tab,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            title: "Henactor".to_string(),
            download_icons: true,
            auto_reload: true,
            key_interval: 200,
            current_theme: "default".to_string(),
            truncation_limit: 40,
            lang: "en".to_string(),
            default_tab: Tab::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Config {
    options: Options,
    keybinds: KeyBindings,
    tabs: Vec<Tab>,
    pins: Vec<Pin>,
}

impl Default for Config {
    fn default() -> Self {
        let pins = directories::BaseDirs::new()
            .map(|dirs| {
                vec![Pin {
                    alias: dirs
                        .home_dir()
                        .file_name()
                        .map(|name| name.to_string_lossy().to_string())
                        .unwrap_or("Home".to_string()),
                    target: dirs.home_dir().to_path_buf(),
                    icon: Some("🏠".to_string()),
                }]
            })
            .unwrap_or(vec![]);

        Config {
            options: Options::default(),
            keybinds: KeyBindings::default(),
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
    let path = config_dir.join(CONFIG_FILE);

    fs::read_to_string(&path)
        .with_context(|| format!("Failed to read {}", path.display()))
        .and_then(|contents| {
            toml::from_str::<Config>(&contents)
                .with_context(|| format!("Failed to parse {}", path.display()))
        })
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
}

#[tauri::command]
#[specta::specta]
pub fn save_config(config_dir: PathBuf, config: Config) -> Result<()> {
    let path = config_dir.join(CONFIG_FILE);

    toml::to_string(&config)
        // This should never happen
        .with_context(|| "Failed to parse config to a string")
        .and_then(|config| {
            fs::write(&path, config)
                .with_context(|| format!("Failed to write config to {}", path.display()))
        })
        .or_else(|err| {
            error!("{err}");
            Err(err.into())
        })
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
            let theme_name = entry.file_name().to_string_lossy().to_string();
            let css_file = entry.path().join(THEME_FILE);
            let icons = fs::read_to_string(entry.path().join(ICONS_FILE))
                .ok()
                .and_then(|content| toml::from_str::<IconsFile>(&content).ok())
                .or_else(|| {
                    warn!("Couldn't read icons file for {theme_name}");
                    None
                });

            if css_file.exists() {
                return Some(Theme {
                    name: theme_name,
                    path: entry.path(),
                    icons,
                    css_file,
                });
            }

            warn!("No css file found for theme {theme_name}",);
            None
        })
        .collect::<Vec<Theme>>()
}
