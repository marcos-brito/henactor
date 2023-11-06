use super::error::Error;
use super::Icons;
use super::Pallete;
use crate::ConfigPath;
use std::fs;
use std::path::Path;

#[tauri::command]
pub fn get_config_path(path: tauri::State<ConfigPath>) -> String {
    return path.inner().0.clone();
}

#[tauri::command]
pub fn get_theme_file(path: tauri::State<ConfigPath>, theme: &str) -> Result<Pallete, Error> {
    let file_name = "theme.json";
    let file_content = match get_appearence_file(path, theme, file_name) {
        Ok(content) => content,
        Err(error) => return Err(error),
    };
    let pallete: Pallete = match serde_json::from_str(&file_content) {
        Ok(pallete) => pallete,
        Err(_) => {
            return Err(Error::ParsingError {
                name: file_name.to_string(),
            })
        }
    };

    Ok(pallete)
}

#[tauri::command]
pub fn get_icons_file(path: tauri::State<ConfigPath>, theme: &str) -> Result<Icons, Error> {
    let file_name = "icons.json";
    let file_content = match get_appearence_file(path, theme, file_name) {
        Ok(content) => content,
        Err(error) => return Err(error),
    };
    let icons: Icons = match serde_json::from_str(&file_content) {
        Ok(icons) => icons,
        Err(_) => {
            return Err(Error::ParsingError {
                name: file_name.to_string(),
            })
        }
    };

    Ok(icons)
}

fn get_appearence_file(
    path: tauri::State<ConfigPath>,
    theme: &str,
    file_name: &str,
) -> Result<String, Error> {
    let path = Path::new(&path.inner().0)
        .join("appearence")
        .join(theme)
        .join(file_name);

    let content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(_) => {
            return Err(Error::ReadingError {
                name: file_name.to_string(),
            })
        }
    };

    Ok(content)
}
