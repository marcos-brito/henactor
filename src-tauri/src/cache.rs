use crate::Result;
use base64ct::{Base64Url, Encoding};
use reqwest::blocking::{get, Response};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
#[specta::specta]
pub fn download_or_find(cache_dir: PathBuf, url: String) -> Result<PathBuf> {
    let hash = Base64Url::encode_string(&Sha256::digest(&url));
    let path = cache_dir.join(&hash);

    if let Some(file) = find_file(&cache_dir, &hash) {
        return Ok(file);
    }

    if !cache_dir.exists() {
        fs::create_dir(&cache_dir)?;
    }

    let res = get(&url)?;
    let ext = ext_of(&res);
    if let Ok(bytes) = res.bytes() {
        fs::write(&path.with_extension(ext), &bytes)?;
    }

    Ok(path)
}

fn ext_of(res: &Response) -> String {
    res.headers()
        .get("content-type")
        .and_then(|header| header.to_str().ok())
        .and_then(mime_guess::get_mime_extensions_str)
        .and_then(|guesses| guesses.first())
        .unwrap_or(&"")
        .to_string()
}

fn find_file(cache_dir: &PathBuf, hash: &str) -> Option<PathBuf> {
    for entry in fs::read_dir(cache_dir).ok()? {
        let entry = entry.ok()?;

        if entry
            .path()
            .file_stem()
            .is_some_and(|stem| stem.to_string_lossy().to_string() == hash)
        {
            return Some(entry.path());
        }
    }

    None
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
