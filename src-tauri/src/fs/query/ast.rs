use crate::fs::EntryType;

#[derive(Clone, Debug, PartialEq)]
pub enum Expr {
    Binary {
        lhs: Box<Expr>,
        op: BinaryOperator,
        rhs: Box<Expr>,
    },
    Unary {
        op: Unary,
        rhs: Box<Expr>,
    },
    Date(String),
    Word(String),
    Property(Property),
    Kind(EntryType),
    PrettyByte(String),
    Regex(String),
}

#[derive(Clone, PartialEq, Debug)]
pub enum Property {
    Name,
    Path,
    Kind,
    Size,
    Created,
    Accessed,
    Modified,
}

#[derive(Clone, PartialEq, Debug)]
pub enum BinaryOperator {
    And,
    Or,
    Lt,
    Gt,
    Lte,
    Gte,
    Eq,
}

#[derive(Clone, PartialEq, Debug)]
pub enum Unary {
    Not,
}

pub trait Visitor {
    type Item;

    fn visit_expr(&self, expr: Expr) -> Self::Item {
        match expr {
            Expr::Binary { lhs, op, rhs } => self.visit_binary_expr(*lhs, op, *rhs),
            Expr::Unary { op, rhs } => self.visit_unary_expr(op, *rhs),
            Expr::Date(str) => self.visit_date(str),
            Expr::Word(str) => self.visit_word(str),
            Expr::Property(prop) => self.visit_property(prop),
            Expr::Kind(kind) => self.visit_kind(kind),
            Expr::PrettyByte(str) => self.visit_pretty_byte(str),
            Expr::Regex(str) => self.visit_regex(str),
        }
    }

    fn visit_binary_expr(&self, lhs: Expr, _op: BinaryOperator, rhs: Expr) -> Self::Item;
    fn visit_unary_expr(&self, _op: Unary, rhs: Expr) -> Self::Item;
    fn visit_date(&self, _str: String) -> Self::Item;
    fn visit_word(&self, _str: String) -> Self::Item;
    fn visit_pretty_byte(&self, _str: String) -> Self::Item;
    fn visit_regex(&self, _str: String) -> Self::Item;
    fn visit_property(&self, _prop: Property) -> Self::Item;
    fn visit_kind(&self, _kind: EntryType) -> Self::Item;
}
