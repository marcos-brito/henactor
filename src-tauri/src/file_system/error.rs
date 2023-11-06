use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize, PartialEq)]
pub enum Error {
    #[error("Could not read {path}'s content")]
    ReadingError { path: String },
    #[error("{path} already exists")]
    AlreadyExists { path: String },
    #[error("{path} does not exists")]
    DoesNotExits { path: String },
}
