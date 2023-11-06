use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize, PartialEq)]
pub enum Error {
    #[error("Could not read the content of {name}")]
    ReadingError { name: String },
    #[error("Could not parse the content of {name}")]
    ParsingError { name: String },
}
