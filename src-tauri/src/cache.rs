use super::Result;
use anyhow::Context;
use base64ct::{Base64Url, Encoding};
use reqwest::blocking::{get, Response};
use sha2::{Digest, Sha256};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
#[specta::specta]
pub fn download_or_find(cache_dir: PathBuf, url: String) -> Result<PathBuf> {
    let hash_str = hash_url(&url);
    let file_path = cache_dir.join(&hash_str);

    if let Some(file) = find_file(&cache_dir, &hash_str) {
        return Ok(file);
    }

    if !cache_dir.exists() {
        fs::create_dir(&cache_dir).with_context(|| "Failed to create cache dir")?;
    }

    let res = get(&url).with_context(|| format!("Request to {url} failed"))?;
    let ext = extract_ext(&res);

    res.bytes()
        .ok()
        .and_then(|bytes| fs::write(&file_path.with_extension(ext), &bytes).ok())
        .with_context(|| format!("Failed to write the response of {url} to the cache"))?;

    Ok(file_path)
}

fn extract_ext(res: &Response) -> String {
    res.headers()
        .get("content-type")
        .and_then(|content_type| {
            let content_type = content_type.to_str().ok()?;

            Some(
                mime_guess::get_mime_extensions_str(content_type)?
                    .first()?
                    .to_string(),
            )
        })
        .unwrap_or("".to_string())
}

fn find_file(cache_dir: &PathBuf, hash: &str) -> Option<PathBuf> {
    fs::read_dir(cache_dir).ok()?.find_map(|entry| {
        let entry = entry.ok()?;

        if entry
            .path()
            .file_stem()
            .is_some_and(|stem| stem.to_string_lossy().to_string() == hash)
        {
            return Some(entry.path());
        }
        None
    })
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
