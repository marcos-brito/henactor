pub mod default;
use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;

pub struct ConfigBuilder {
    config_dir: String,
    base_dirs: BaseDirs,
}

impl ConfigBuilder {
    pub fn new(config_dir: &str) -> ConfigBuilder {
        ConfigBuilder {
            config_dir: config_dir.to_string(),
            base_dirs: BaseDirs::new().expect("Could not found path to base directories"),
        }
    }

    /// Creates a configuration directory with the related name
    /// in the default directory for the given operational system.
    ///
    /// If the directory already exist it does nothing.
    ///
    /// It panics in case of fail.
    pub fn create_config_dir(&self) {
        let config_dir = self.base_dirs.config_dir();
        let config_path = config_dir.join(self.config_dir.as_str());

        if !config_path.exists() {
            fs::create_dir(config_path).expect("Could not create config directory");
        }
    }

    /// Removes the configuration directory recusively.
    ///
    /// It panics in fail.
    pub fn remove_config_dir(&self) {
        let config_dir = self.base_dirs.config_dir();
        let config_path = config_dir.join(self.config_dir.as_str());

        fs::remove_dir_all(config_path).expect("Could not remove config directory");
    }

    /// Adds a file with the given content to the configuration
    /// directory.
    ///
    /// It uses [serde](https://serde.rs/) to parse data into
    /// strings.
    ///
    /// It panics if any of the operations fail.
    pub fn add_config_file<T>(&self, name: &str, content: &T)
    where
        T: Serialize,
    {
        let path = self
            .base_dirs
            .config_dir()
            .join(self.config_dir.as_str())
            .join(name);
        let content =
            serde_json::to_string(content).expect("Could not parse the structure to a string");

        fs::write(path, content).expect("Could not write the configuration file");
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use std::error::Error;

    #[test]
    fn test_create_config_dir() -> () {
        const TARGET_NAME: &str = "test";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir();

        let config = ConfigBuilder::new(TARGET_NAME);
        config.create_config_dir();
        let config_path_exist = config_dir.join(TARGET_NAME).exists();

        fs::remove_dir(config_dir.join(TARGET_NAME)).unwrap();
        assert!(config_path_exist);
    }

    #[test]
    #[should_panic]
    fn test_create_config_dir_should_panic() -> () {
        const TARGET_NAME: &str = "test2";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir();

        fs::create_dir(config_dir.join(TARGET_NAME)).unwrap();

        let config = ConfigBuilder::new(TARGET_NAME);
        config.create_config_dir();

        fs::remove_dir(config_dir.join(TARGET_NAME)).unwrap();
    }

    #[test]
    fn test_remove_config_dir() -> () {
        const TARGET_NAME: &str = "test3";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir();

        fs::create_dir(config_dir.join(TARGET_NAME)).unwrap();

        let config = ConfigBuilder::new(TARGET_NAME);
        config.remove_config_dir();

        let config_path_exist = config_dir.join(TARGET_NAME).exists();

        assert!(!config_path_exist);
    }

    #[test]
    fn test_add_config_file() -> () {
        const TARGET_NAME: &str = "test4";

        let base_dir = BaseDirs::new().unwrap();
        let config_dir = base_dir.config_dir().join(TARGET_NAME);

        let config = ConfigBuilder::new(TARGET_NAME);
        config.create_config_dir();

        #[derive(Serialize)]
        struct Colors {
            blue: String,
            red: String,
        }

        let my_config = Colors {
            blue: "#5390ed".to_string(),
            red: "#ed6453".to_string(),
        };

        config.add_config_file("colors.json", &my_config);

        let expected = String::from("{\"blue\":\"#5390ed\",\"red\":\"#ed6453\"}");
        let actual = fs::read_to_string(config_dir.join("colors.json")).unwrap();

        fs::remove_dir_all(config_dir.join("colors.json")).unwrap();

        assert_eq!(expected, actual);
    }
}
