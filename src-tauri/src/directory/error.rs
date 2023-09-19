use serde::Serialize;
use std::io;
use thiserror::Error;

#[derive(Error, Debug, Serialize, PartialEq)]
pub enum Error {
    #[error("Could not read {path}'s content")]
    ReadingError { path: String },
}
