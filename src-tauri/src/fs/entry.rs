use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use std::time::SystemTime;
use std::{fmt, fs};

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Entry {
    name: String,
    path: PathBuf,
    mime: Option<String>,
    metadata: Metadata,
}

impl Entry {
    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn path(&self) -> &PathBuf {
        &self.path
    }

    pub fn kind(&self) -> &Kind {
        &self.metadata.kind
    }
    }

    pub fn mime(&self) -> Option<&str> {
        self.mime.as_deref()
    }

    pub fn size(&self) -> Option<u64> {
        self.metadata.size.clone()
    }

    pub fn created_at(&self) -> Option<SystemTime> {
        self.metadata.created_at.clone()
    }

    pub fn accessed_at(&self) -> Option<SystemTime> {
        self.metadata.accessed_at.clone()
    }

    pub fn modified_at(&self) -> Option<SystemTime> {
        self.metadata.modified_at.clone()
    }
}

impl From<PathBuf> for Entry {
    fn from(path: PathBuf) -> Self {
        let metadata = path.metadata().ok();

        Self {
            name: path
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .unwrap_or("..".to_string()),
            mime: mime_guess::from_path(&path)
                .first()
                .map(|guess| guess.to_string()),
            metadata: metadata.map(Metadata::from).unwrap_or_default(),
            path,
        }
    }
}

impl From<&fs::DirEntry> for Entry {
    fn from(entry: &fs::DirEntry) -> Self {
        Entry::from(entry.path())
    }
}

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Metadata {
    kind: Kind,
    size: Option<u64>,
    created_at: Option<SystemTime>,
    accessed_at: Option<SystemTime>,
    modified_at: Option<SystemTime>,
}

impl Default for Metadata {
    fn default() -> Self {
        Self {
            kind: Kind::Unknown,
            size: None,
            created_at: None,
            accessed_at: None,
            modified_at: None,
        }
    }
}

impl From<fs::Metadata> for Metadata {
    fn from(value: fs::Metadata) -> Self {
        Self {
            kind: Kind::from(value.file_type()),
            size: Some(value.len()),
            created_at: value.created().ok(),
            accessed_at: value.accessed().ok(),
            modified_at: value.modified().ok(),
        }
    }
}

#[derive(Serialize, Deserialize, Type, Clone, PartialOrd, Ord, PartialEq, Eq, Debug)]
pub enum Kind {
    Directory,
    File,
    Symlink,
    Unknown,
}

impl fmt::Display for Kind {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Directory => write!(f, "directory"),
            Self::File => write!(f, "file"),
            Self::Symlink => write!(f, "link"),
            Self::Unknown => write!(f, "unknown"),
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
