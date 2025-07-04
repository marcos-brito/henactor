use super::ast::{BinaryOperator, Expr, Property, Unary, Visitor};
use crate::fs::{Entry, EntryType};
use anyhow::{Context, Result};
use bytesize::ByteSize;
use std::time::SystemTime;

trait Obj: PartialEq<Object> + PartialOrd<Object> {
    fn to_bool(&self, entry: &Entry) -> Bool;
}

enum Object {
    Date(Date),
    Literal(Literal),
    Regex(Regex),
    Number(Number),
    Bool(Bool),
}

impl Object {
    fn inner(&self) -> &dyn Obj {
        match self {
            Object::Date(v) => v,
            Object::Literal(v) => v,
            Object::Regex(v) => v,
            Object::Number(v) => v,
            Object::Bool(v) => v,
        }
    }
}

impl Obj for Object {
    fn to_bool(&self, entry: &Entry) -> Bool {
        self.inner().to_bool(entry)
    }
}

impl PartialEq<Object> for Object {
    fn eq(&self, other: &Object) -> bool {
        self.inner() == other
    }
}

impl PartialOrd<Object> for Object {
    fn partial_cmp(&self, other: &Object) -> Option<std::cmp::Ordering> {
        self.inner().partial_cmp(&other)
    }
}

impl From<Date> for Object {
    fn from(value: Date) -> Self {
        Self::Date(value)
    }
}

impl From<Literal> for Object {
    fn from(value: Literal) -> Self {
        Self::Literal(value)
    }
}

impl From<Number> for Object {
    fn from(value: Number) -> Self {
        Self::Number(value)
    }
}

impl From<Regex> for Object {
    fn from(value: Regex) -> Self {
        Self::Regex(value)
    }
}

impl From<Bool> for Object {
    fn from(value: Bool) -> Self {
        Self::Bool(value)
    }
}

struct Bool(bool);

impl Obj for Bool {
    fn to_bool(&self, _entry: &Entry) -> Bool {
        Bool(self.0)
    }
}

impl PartialEq<Object> for Bool {
    fn eq(&self, other: &Object) -> bool {
        match other {
            Object::Bool(v) => v.0 == self.0,
            _ => false,
        }
    }
}

impl PartialOrd<Object> for Bool {
    fn partial_cmp(&self, other: &Object) -> Option<std::cmp::Ordering> {
        match other {
            Object::Bool(v) => Some(self.0.cmp(&v.0)),
            _ => None,
        }
    }
}

struct Date(SystemTime);

impl Obj for Date {
    fn to_bool(&self, entry: &Entry) -> Bool {
        Bool(entry.details.created.is_some_and(|c| self.0 == c))
    }
}

impl PartialEq<Object> for Date {
    fn eq(&self, other: &Object) -> bool {
        match other {
            Object::Date(v) => self.0 == v.0,
            _ => false,
        }
    }
}

impl PartialOrd<Object> for Date {
    fn partial_cmp(&self, other: &Object) -> Option<std::cmp::Ordering> {
        match other {
            Object::Date(v) => Some(self.0.cmp(&v.0)),
            _ => None,
        }
    }
}

struct Literal(String);

impl Obj for Literal {
    fn to_bool(&self, entry: &Entry) -> Bool {
        Bool(entry.name.to_lowercase().contains(&self.0))
    }
}

impl PartialEq<Object> for Literal {
    fn eq(&self, other: &Object) -> bool {
        match other {
            Object::Literal(v) => self.0.contains(&v.0),
            Object::Regex(v) => v.0.is_match(&self.0),
            _ => false,
        }
    }
}

impl PartialOrd<Object> for Literal {
    fn partial_cmp(&self, other: &Object) -> Option<std::cmp::Ordering> {
        match other {
            Object::Literal(v) => Some(self.0.cmp(&v.0)),
            _ => None,
        }
    }
}

struct Regex(regex::Regex);

impl Obj for Regex {
    fn to_bool(&self, entry: &Entry) -> Bool {
        Bool(
            self.0.is_match(&entry.name)
                || self.0.is_match(&entry.path.to_string_lossy().to_string()),
        )
    }
}

impl PartialEq<Object> for Regex {
    fn eq(&self, other: &Object) -> bool {
        match other {
            Object::Literal(v) => self.0.is_match(&v.0),
            Object::Regex(v) => self.0.to_string() == v.0.to_string(),
            _ => false,
        }
    }
}

impl PartialOrd<Object> for Regex {
    fn partial_cmp(&self, _other: &Object) -> Option<std::cmp::Ordering> {
        None
    }
}

struct Number(u64);

impl Obj for Number {
    fn to_bool(&self, entry: &Entry) -> Bool {
        Bool(entry.details.size == self.0)
    }
}

impl PartialEq<Object> for Number {
    fn eq(&self, other: &Object) -> bool {
        match other {
            Object::Number(v) => self.0 == v.0,
            _ => false,
        }
    }
}

impl PartialOrd<Object> for Number {
    fn partial_cmp(&self, other: &Object) -> Option<std::cmp::Ordering> {
        match other {
            Object::Number(v) => Some(self.0.cmp(&v.0)),
            _ => None,
        }
    }
}

struct Evaluator<'a> {
    entry: &'a Entry,
}

impl<'a> Evaluator<'a> {
    fn new(entry: &'a Entry) -> Self {
        Self { entry }
    }
}

pub fn eval(entry: &Entry, expr: Expr) -> Result<bool> {
    Ok(Evaluator::new(entry).visit_expr(expr)?.to_bool(entry).0)
}

impl<'a> Visitor for Evaluator<'a> {
    type Item = anyhow::Result<Object>;

    fn visit_binary_expr(&self, lhs: Expr, op: BinaryOperator, rhs: Expr) -> Self::Item {
        let lobj = self.visit_expr(lhs)?;
        let robj = self.visit_expr(rhs)?;
        let res = match op {
            BinaryOperator::Eq => Bool(lobj == robj).into(),
            BinaryOperator::Lt => Bool(lobj < robj).into(),
            BinaryOperator::Gt => Bool(lobj > robj).into(),
            BinaryOperator::Lte => Bool(lobj <= robj).into(),
            BinaryOperator::Gte => Bool(lobj >= robj).into(),
            BinaryOperator::And => {
                Bool(lobj.to_bool(&self.entry).0 && robj.to_bool(&self.entry).0).into()
            }
            BinaryOperator::Or => {
                Bool(lobj.to_bool(&self.entry).0 || robj.to_bool(&self.entry).0).into()
            }
        };

        Ok(res)
    }

    fn visit_unary_expr(&self, op: Unary, rhs: Expr) -> Self::Item {
        let robj = self.visit_expr(rhs)?;
        let res = match op {
            Unary::Not => Bool(!robj.to_bool(&self.entry).0).into(),
        };

        Ok(res)
    }

    fn visit_property(&self, prop: Property) -> Self::Item {
        let obj = match prop {
            Property::Name => Literal(self.entry.name.clone()).into(),
            Property::Path => Literal(self.entry.path.to_string_lossy().to_string()).into(),
            Property::Size => Number(self.entry.details.size).into(),
            Property::Kind => Literal(self.entry.entry_type.to_string()).into(),
            Property::Created => {
                Date(self.entry.details.created.unwrap_or(SystemTime::now())).into()
            }
            Property::Modified => {
                Date(self.entry.details.modified.unwrap_or(SystemTime::now())).into()
            }
            Property::Accessed => {
                Date(self.entry.details.accessed.unwrap_or(SystemTime::now())).into()
            }
        };

        Ok(obj)
    }

    fn visit_word(&self, str: String) -> Self::Item {
        Ok(Literal(str).into())
    }

    fn visit_kind(&self, kind: EntryType) -> Self::Item {
        Ok(Literal(kind.to_string()).into())
    }

    fn visit_pretty_byte(&self, str: String) -> Self::Item {
        match str.parse::<ByteSize>() {
            Ok(size) => Ok(Number(size.as_u64()).into()),
            Err(_) => Err(anyhow::anyhow!("Bad size: {str}")),
        }
    }

    fn visit_date(&self, str: String) -> Self::Item {
        humantime::parse_rfc3339_weak(&str)
            .with_context(|| format!("Bad date: {str}"))
            .map(|date| Date(date).into())
    }

    fn visit_regex(&self, str: String) -> Self::Item {
        regex::Regex::new(&str)
            .with_context(|| format!("Bad regex: {str}"))
            .map(|regex| Regex(regex).into())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use anyhow::Result;
    use std::cmp;
    use std::time;

    #[test]
    fn date_equality() -> Result<()> {
        let tests = vec![
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Date(Date(time::UNIX_EPOCH)),
                true,
            ),
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Literal(Literal("2024".to_string())),
                false,
            ),
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Number(Number(12)),
                false,
            ),
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Regex(Regex(regex::Regex::new(".").unwrap())),
                false,
            ),
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Bool(Bool(false)),
                false,
            ),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left == right, expected)
        }

        Ok(())
    }

    #[test]
    fn date_ordering() -> Result<()> {
        let tests = vec![
            (
                Object::Date(Date(time::UNIX_EPOCH)),
                Object::Date(Date(time::SystemTime::now())),
                cmp::Ordering::Less,
            ),
            (
                Object::Date(Date(time::SystemTime::now())),
                Object::Date(Date(time::UNIX_EPOCH)),
                cmp::Ordering::Greater,
            ),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left.partial_cmp(&right), Some(expected))
        }

        Ok(())
    }

    #[test]
    fn regex_equality() -> Result<()> {
        let tests = vec![
            (
                Object::Regex(Regex(regex::Regex::new(".").unwrap())),
                Object::Regex(Regex(regex::Regex::new(".").unwrap())),
                true,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("sometext$").unwrap())),
                Object::Literal(Literal("__sometext".to_string())),
                true,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("^sometext").unwrap())),
                Object::Literal(Literal("__sometext".to_string())),
                false,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("12").unwrap())),
                Object::Number(Number(12)),
                false,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("false").unwrap())),
                Object::Bool(Bool(false)),
                false,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("12/12/2301").unwrap())),
                Object::Date(Date(time::UNIX_EPOCH)),
                false,
            ),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left == right, expected)
        }

        Ok(())
    }

    #[test]
    fn literal_equality() -> Result<()> {
        let tests = vec![
            (
                Object::Literal(Literal("__contains__".to_string())),
                Object::Literal(Literal("contains".to_string())),
                true,
            ),
            (
                Object::Literal(Literal("__sometext".to_string())),
                Object::Regex(Regex(regex::Regex::new("sometext$").unwrap())),
                true,
            ),
            (
                Object::Literal(Literal("__contains__".to_string())),
                Object::Literal(Literal("sometext".to_string())),
                false,
            ),
            (
                Object::Regex(Regex(regex::Regex::new("^sometext").unwrap())),
                Object::Literal(Literal("__sometext".to_string())),
                false,
            ),
            (
                Object::Literal(Literal("123".to_string())),
                Object::Number(Number(123)),
                false,
            ),
            (
                Object::Literal(Literal("false".to_string())),
                Object::Bool(Bool(false)),
                false,
            ),
            (
                Object::Literal(Literal("1970-01-01 00:00:00".to_string())),
                Object::Date(Date(time::UNIX_EPOCH)),
                false,
            ),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left == right, expected)
        }

        Ok(())
    }

    #[test]
    fn number_equality() -> Result<()> {
        let tests = vec![
            (
                Object::Number(Number(123)),
                Object::Number(Number(123)),
                true,
            ),
            (
                Object::Number(Number(123)),
                Object::Number(Number(1234)),
                false,
            ),
            (
                Object::Number(Number(123)),
                Object::Regex(Regex(regex::Regex::new("123").unwrap())),
                false,
            ),
            (
                Object::Number(Number(123)),
                Object::Literal(Literal("123".to_string())),
                false,
            ),
            (
                Object::Number(Number(1970)),
                Object::Date(Date(time::UNIX_EPOCH)),
                false,
            ),
            (Object::Number(Number(1)), Object::Bool(Bool(true)), false),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left == right, expected)
        }

        Ok(())
    }

    #[test]
    fn bool_equality() -> Result<()> {
        let tests = vec![
            (Object::Bool(Bool(false)), Object::Bool(Bool(false)), true),
            (Object::Bool(Bool(false)), Object::Bool(Bool(true)), false),
            (Object::Bool(Bool(false)), Object::Number(Number(0)), false),
            (
                Object::Bool(Bool(false)),
                Object::Regex(Regex(regex::Regex::new("false").unwrap())),
                false,
            ),
            (
                Object::Bool(Bool(false)),
                Object::Literal(Literal("false".to_string())),
                false,
            ),
            (
                Object::Bool(Bool(false)),
                Object::Date(Date(time::UNIX_EPOCH)),
                false,
            ),
        ];

        for (left, right, expected) in tests {
            assert_eq!(left == right, expected)
        }

        Ok(())
    }
}
