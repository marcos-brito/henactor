use super::Result;
use crate::fs::sort::SortMethod;
use log::warn;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

pub const CONFIG_FILE: &str = "henactor.toml";
pub const THEMES_DIR: &str = "themes";
pub const THEME_FILE: &str = "theme.css";
pub const ICONS_FILE: &str = "icons.toml";

pub type KeyBindings = HashMap<String, Vec<String>>;
pub type Openers = HashMap<String, String>;

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
    sort_by: SortMethod,
    filter: String,
    query: String,
    selected: Vec<PathBuf>,
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
            sort_by: SortMethod::Natural,
            filter: "".to_string(),
            query: "".to_string(),
            selected: vec![],
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
    settings: Option<String>,
    commands: Option<String>,
    keyboard: Option<String>,
    rotate: Option<String>,
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
    edit: Option<String>,
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
    css: Option<PathBuf>,
    icons: Option<IconsFile>,
}

impl Theme {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        let path = path.as_ref().to_path_buf();
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or(String::new());
        let css = path
            .join(THEME_FILE)
            .exists()
            .then_some(path.join(THEME_FILE));
        let icons = fs::read_to_string(path.join(ICONS_FILE))
            .ok()
            .and_then(|f| toml::from_str(&f).ok());

        Self {
            path,
            name,
            css,
            icons,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Options {
    title: String,
    download_icons: bool,
    auto_reload: bool,
    current_theme: String,
    key_interval: u32,
    delete_timeout: u32,
    lang: String,
    truncation_limit: u8,
    default_tab: Tab,
    commit_mode: bool,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            title: "Henactor".to_string(),
            download_icons: true,
            auto_reload: true,
            key_interval: 200,
            delete_timeout: 1500,
            current_theme: "default".to_string(),
            truncation_limit: 40,
            lang: "en".to_string(),
            default_tab: Tab::default(),
            commit_mode: false,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
pub struct Config {
    options: Options,
    keybinds: KeyBindings,
    openers: Openers,
    status: Vec<String>,
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
            openers: Openers::default(),
            status: vec![],
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
    let config = fs::read_to_string(config_dir.join(CONFIG_FILE))?;

    Ok(toml::from_str(&config)?)
}

#[tauri::command]
#[specta::specta]
pub fn save_config(config_dir: PathBuf, config: Config) -> Result<()> {
    fs::write(config_dir.join(CONFIG_FILE), toml::to_string(&config)?)?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn find_themes(config_dir: PathBuf) -> Vec<Theme> {
    let themes_dir = config_dir.join(THEMES_DIR);
    let entries = match fs::read_dir(&themes_dir) {
        Ok(entries) => entries,
        Err(err) => {
            warn!("failed to read themes at {}: {}", themes_dir.display(), err);
            return Vec::new();
        }
    };

    entries
        .filter_map(|entry| match entry {
            Ok(e) => Some(Theme::new(e.path())),
            Err(_) => None,
        })
        .collect()
}
