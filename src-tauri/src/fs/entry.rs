use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use std::time::SystemTime;
use std::{fmt, fs, io};

#[derive(Serialize, Deserialize, Type, Clone)]
pub struct Entry {
    name: String,
    path: PathBuf,
    kind: Kind,
    mime: Option<String>,
    size: u64,
    created_at: Option<SystemTime>,
    accessed_at: Option<SystemTime>,
    modified_at: Option<SystemTime>,
}

impl Entry {
    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn path(&self) -> &PathBuf {
        &self.path
    }

    pub fn kind(&self) -> &Kind {
        &self.kind
    }

    pub fn mime(&self) -> Option<&str> {
        self.mime.as_deref()
    }

    pub fn size(&self) -> u64 {
        self.size.clone()
    }

    pub fn created_at(&self) -> Option<SystemTime> {
        self.created_at.clone()
    }

    pub fn accessed_at(&self) -> Option<SystemTime> {
        self.accessed_at.clone()
    }

    pub fn modified_at(&self) -> Option<SystemTime> {
        self.modified_at.clone()
    }
}

impl TryFrom<PathBuf> for Entry {
    type Error = io::Error;

    fn try_from(path: PathBuf) -> Result<Self, Self::Error> {
        path.metadata().map(|metadata| Self {
            name: path
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .unwrap_or("..".to_string()),
            mime: mime_guess::from_path(&path)
                .first()
                .map(|guess| guess.to_string()),
            size: metadata.len(),
            kind: metadata.file_type().into(),
            path,
            created_at: metadata.created().ok(),
            modified_at: metadata.modified().ok(),
            accessed_at: metadata.accessed().ok(),
        })
    }
}

impl TryFrom<&fs::DirEntry> for Entry {
    type Error = io::Error;

    fn try_from(entry: &fs::DirEntry) -> Result<Self, Self::Error> {
        Entry::try_from(entry.path())
    }
}

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
