pub mod commands;
pub mod default;
mod error;

use crate::ConfigPath;
use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

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
struct Colors {
    red: String,
    blue: String,
    green: String,
    yellow: String,
    purple: String,
}

#[derive(Deserialize, Serialize)]
pub struct Icons {
    directory: String,
    file: String,
    settings: String,
    view: String,
    sort: String,
    filter: String,
    search: String,
    close: String,
    add: String,
}

#[derive(Serialize, Deserialize)]
struct PinnedItem {
    name: String,
    path: String,
    icon: String,
}

#[derive(Serialize, Deserialize)]
pub struct Pinned {
    items: Vec<PinnedItem>,
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

pub struct ConfigGenerator {
    base_dirs: BaseDirs,
    pub config_dir_path: PathBuf,
}

impl ConfigGenerator {
    pub fn new(config_dir: &str) -> ConfigGenerator {
        let base_dirs = BaseDirs::new().expect("Could not found path to base directories");
        ConfigGenerator {
            config_dir_path: base_dirs.config_dir().join(config_dir).to_owned(),
            base_dirs,
        }
    }

    /// Creates a configuration directory with the related name
    /// in the default directory for the given operational system.
    ///
    /// If the directory already exist it does nothing.
    ///
    /// It panics in case of fail.
    pub fn create_config_dir(&self) {
        if !&self.config_dir_path.exists() {
            fs::create_dir(&self.config_dir_path).expect("Could not create config directory");
        }
    }

    /// Removes the configuration directory recusively.
    ///
    /// It panics in fail.
    pub fn remove_config_dir(&self) {
        if self.config_dir_path.exists() {
            fs::remove_dir_all(&self.config_dir_path).expect("Could not remove config directory");
        }
    }

    /// Adds a file with the given content to the configuration
    /// directory.
    ///
    /// It uses [serde](https://serde.rs/) to parse data into
    /// strings.
    ///
    /// It panics if any of the operations fail.
    pub fn add_config_file<T>(&self, path: &str, content: &T)
    where
        T: Serialize,
    {
        let path = &self.config_dir_path.join(path);
        let content =
            serde_json::to_string(content).expect("Could not parse the structure to a string");

        if !path.exists() {
            fs::write(path, content).expect("Could not write the configuration file");
        }
    }

    /// Remove a file in the configuration directory.
    ///
    /// It panics if it fails.
    pub fn remove_config_file(&self, path: &str) {
        let path = &self.config_dir_path.join(path);

        if path.exists() {
            fs::remove_file(path).expect("Could not remove the configuration file");
        }
    }

    /// Adds a new directory inside the main config directory.
    ///
    /// It panics in fail.
    pub fn add_sub_dir(&self, path: &str) {
        let path = &self.config_dir_path.join(path);

        if !path.exists() {
            fs::create_dir(path).expect("Could not create the dir");
        }
    }

    /// Remove a directory inside the main config directory.
    ///
    /// It panins in fail.
    pub fn remove_sub_dir(&self, path: &str) {
        let path = &self.config_dir_path.join(path);

        if path.exists() {
            fs::remove_dir_all(path).expect("")
        }
    }
}

#[tauri::command]
pub fn get_appearence_file(path: &tauri::State<ConfigPath>, theme_name: &str) -> Pallete {
    let path = Path::new(&path.inner().0)
        .join("appearence")
        .join(theme_name);

    let file_content = fs::read_to_string(path).unwrap();
    let theme: Pallete = serde_json::from_str(file_content.as_str()).unwrap();

    theme
}

#[cfg(test)]
mod test {
    use super::*;
    use serde::{Deserialize, Serialize};
    use std::error::Error;

    #[test]
    fn test_create_config_dir() -> Result<(), Box<dyn Error>> {
        const TARGET_NAME: &str = "test3";

        let base_dirs = BaseDirs::new().unwrap();
        let config_dir_path = base_dirs.config_dir();

        let config = ConfigGenerator::new(TARGET_NAME);
        config.create_config_dir();
        let config_path_exist = config_dir_path.join(TARGET_NAME).exists();

        assert!(config_path_exist);
        Ok(())
    }

    #[test]
    fn test_remove_config_dir() -> () {
        const TARGET_NAME: &str = "test5";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir();

        fs::create_dir(config_dir.join(TARGET_NAME)).unwrap();

        let config = ConfigGenerator::new(TARGET_NAME);
        config.remove_config_dir();

        let config_path_exist = config_dir.join(TARGET_NAME).exists();

        assert!(!config_path_exist);
    }

    #[test]
    fn test_add_config_file() -> () {
        const TARGET_NAME: &str = "test4";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir().join(TARGET_NAME);

        let config = ConfigGenerator::new(TARGET_NAME);
        config.create_config_dir();

        #[derive(Serialize, Deserialize)]
        struct Colors {
            blue: String,
            red: String,
        }

        let config_file = Colors {
            blue: "#5390ed".to_string(),
            red: "#ed6453".to_string(),
        };

        config.add_config_file("colors.json", &config_file);

        let expected = String::from("{\"blue\":\"#5390ed\",\"red\":\"#ed6453\"}");
        let actual = fs::read_to_string(config_dir.join("colors.json")).unwrap();

        fs::remove_dir_all(config_dir).unwrap();

        assert_eq!(expected, actual);
    }
}
