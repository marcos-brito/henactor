use super::Result;
use base64ct::{Base64Url, Encoding};
use reqwest::blocking::get;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
#[specta::specta]
// FIX: Currently svg won't render in the client side. It happens because
// there is no mime types or extension that says to <img/> what to do. Need to find
// a way to include the file extension here without breaking the lookup.
pub fn download_or_find(cache_dir: PathBuf, url: String) -> Result<PathBuf> {
    let hash_str = hash_url(&url);
    let file_path = cache_dir.join(&hash_str);

    if file_path.exists() {
        return Ok(cache_dir.join(&hash_str));
    }

    if !cache_dir.exists() {
        fs::create_dir(&cache_dir)?;
    }

    let bytes = get(&url)?.bytes()?;
    fs::write(&file_path, &bytes)?;

    Ok(file_path)
}

fn hash_url(url: &str) -> String {
    let hash = Sha256::digest(url);
    Base64Url::encode_string(&hash)
}

#[cfg(test)]
mod tests {
    use super::*;
    use anyhow::Result;
    use tempfile::tempdir;

    const URL: &str = "https://api.iconify.design/fluent-emoji-flat/alarm-clock.svg";

    #[test]
    fn should_download_and_cache() -> Result<()> {
        let dir = tempdir()?;
        let path = download_or_find(dir.path().to_path_buf(), URL.to_string())?;

        assert!(path.exists());

        Ok(())
    }
}
