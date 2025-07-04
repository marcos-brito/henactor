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
    details: EntryDetails,
}

impl TryFrom<PathBuf> for Entry {
    type Error = io::Error;

    fn try_from(path: PathBuf) -> Result<Self, Self::Error> {
        path.metadata().map(|metadata| Self {
            name: path
                .file_name()
                .map(|name| name.to_string_lossy().to_string())
                .unwrap_or(String::new()),
            kind: metadata.file_type().into(),
            mime: mime_guess::from_path(&path)
                .first()
                .map(|guess| guess.to_string()),
            details: metadata.into(),
            path,
        })
    }
}

impl TryFrom<&fs::DirEntry> for Entry {
    type Error = io::Error;

    fn try_from(entry: &fs::DirEntry) -> Result<Self, Self::Error> {
        Entry::try_from(entry.path())
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
