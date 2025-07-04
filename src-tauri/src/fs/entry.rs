use anyhow::Context;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs;
use std::path::PathBuf;
use std::time::SystemTime;

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Entry {
    name: String,
    path: PathBuf,
    kind: Kind,
    details: EntryDetails,
}

impl TryFrom<&fs::DirEntry> for Entry {
    type Error = anyhow::Error;

    fn try_from(entry: &fs::DirEntry) -> std::result::Result<Self, Self::Error> {
        Ok(Self {
            name: entry.file_name().to_string_lossy().to_string(),
            path: entry.path(),
            entry_type: entry
                .file_type()
                .map(|file_type| file_type.into())
                .with_context(|| {
                    format!("Failed to get file type of {}", entry.path().display())
                })?,
            details: entry.metadata().map(|metadata| metadata.into())?,
        })
    }
}

impl TryFrom<PathBuf> for Entry {
    type Error = anyhow::Error;

    fn try_from(path: PathBuf) -> std::result::Result<Self, Self::Error> {
        let metadata = path
            .metadata()
            .with_context(|| format!("Failed to get metadata of {}", path.display()))?;

        Ok(Self {
            name: path
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .with_context(|| format!("Failed to get file name for {}", path.display()))?,
            entry_type: metadata.file_type().into(),
            details: metadata.into(),
            path,
        })
    }
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct EntryDetails {
    created: Option<SystemTime>,
    accessed: Option<SystemTime>,
    modified: Option<SystemTime>,
    permissions: Option<Permissions>,
    size: u64,
}

impl From<fs::Metadata> for EntryDetails {
    fn from(metadata: fs::Metadata) -> Self {
        Self {
            created: metadata.created().ok(),
            accessed: metadata.accessed().ok(),
            modified: metadata.modified().ok(),
            permissions: None,
            size: metadata.len(),
        }
    }
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Permissions {}

#[derive(Serialize, Deserialize, Type, Clone, PartialOrd, Ord, PartialEq, Eq, Debug)]
pub enum Kind {
    Directory,
    File,
    Symlink,
}

impl fmt::Display for Kind {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Directory => write!(f, "directory"),
            Self::File => write!(f, "file"),
            Self::Symlink => write!(f, "link"),
        }
    }
}

impl From<fs::FileType> for Kind {
    fn from(file_type: fs::FileType) -> Self {
        if file_type.is_dir() {
            return Kind::Directory;
        }

        if file_type.is_symlink() {
            return Kind::Symlink;
        }

        Kind::File
    }
}
