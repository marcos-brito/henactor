use super::Entry;
use crate::Result;

mod ast;
mod eval;
mod parser;

#[tauri::command]
#[specta::specta]
pub fn filter(entries: Vec<Entry>, filter: String) -> Result<Vec<Entry>> {
    Ok(parser::parse(&filter)
        .map(|pairs| parser::convert(pairs))
        .map(|expr| {
            entries
                .into_iter()
                // TODO: Not clone. Changing the Visitor should allow to pass a reference
                .filter(|entry| eval::eval(&entry, expr.clone()).is_ok())
                .collect()
        })?)
}
