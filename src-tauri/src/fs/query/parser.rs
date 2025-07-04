use super::ast::{BinaryOperator, Expr, Property, Unary};
use crate::fs::entry::Kind;
use anyhow::Result;
use pest::iterators::{Pair, Pairs};
use pest::pratt_parser::{Assoc, Op, PrattParser};
use pest::Parser;
use std::sync::OnceLock;

#[derive(pest_derive::Parser)]
#[grammar = "fs/filter.pest"]
pub struct FilterParser;

fn parser() -> &'static PrattParser<Rule> {
    static PRATT_PARSER: OnceLock<PrattParser<Rule>> = OnceLock::new();

    PRATT_PARSER.get_or_init(|| {
        PrattParser::new()
            .op(Op::prefix(Rule::not))
            .op(Op::infix(Rule::and, Assoc::Left) | Op::infix(Rule::or, Assoc::Left))
            .op(Op::infix(Rule::eq, Assoc::Left)
                | Op::infix(Rule::gt, Assoc::Left)
                | Op::infix(Rule::lt, Assoc::Left)
                | Op::infix(Rule::lte, Assoc::Left)
                | Op::infix(Rule::gte, Assoc::Left))
    })
}

pub fn parse(filter: &str) -> Result<Pairs<Rule>> {
    Ok(FilterParser::parse(Rule::expr, filter)?)
}

pub fn convert(pairs: Pairs<Rule>) -> Expr {
    parser()
        .map_primary(|primary| match primary.as_rule() {
            Rule::expr => convert(primary.into_inner()),
            Rule::property => convert_property(primary.into_inner().next().unwrap()),
            Rule::pretty_byte => Expr::PrettyByte(primary.as_str().parse().unwrap()),
            Rule::entry_kind => convert_entry_kind(primary.into_inner().next().unwrap()),
            Rule::regex => Expr::Regex(primary.as_str().trim_matches('/').parse().unwrap()),
            Rule::date => Expr::Date(primary.as_str().trim_matches('$').parse().unwrap()),
            Rule::group => convert(primary.into_inner()),
            Rule::word => Expr::Word(primary.as_str().trim_matches(['"', '\'']).parse().unwrap()),
            _ => unreachable!(),
        })
        .map_prefix(|op, rhs| match op.as_rule() {
            Rule::not => Expr::Unary {
                op: Unary::Not,
                rhs: Box::new(rhs),
            },
            _ => unreachable!(),
        })
        .map_infix(|lhs, op, rhs| {
            let op = match op.as_rule() {
                Rule::and => BinaryOperator::And,
                Rule::or => BinaryOperator::Or,
                Rule::lt => BinaryOperator::Lt,
                Rule::gt => BinaryOperator::Gt,
                Rule::lte => BinaryOperator::Lte,
                Rule::gte => BinaryOperator::Gte,
                Rule::eq => BinaryOperator::Eq,
                _ => unreachable!(),
            };

            Expr::Binary {
                lhs: Box::new(lhs),
                op,
                rhs: Box::new(rhs),
            }
        })
        .parse(pairs)
}

fn convert_entry_kind(pair: Pair<Rule>) -> Expr {
    match pair.as_rule() {
        Rule::file => Expr::Kind(Kind::File),
        Rule::dir => Expr::Kind(Kind::Directory),
        Rule::link => Expr::Kind(Kind::Symlink),
        _ => unreachable!(),
    }
}

fn convert_property(pair: Pair<Rule>) -> Expr {
    match pair.as_rule() {
        Rule::name => Expr::Property(Property::Name),
        Rule::path => Expr::Property(Property::Path),
        Rule::kind => Expr::Property(Property::Kind),
        Rule::size => Expr::Property(Property::Size),
        Rule::created => Expr::Property(Property::Created),
        Rule::accessed => Expr::Property(Property::Accessed),
        Rule::modified => Expr::Property(Property::Modified),
        _ => unreachable!(),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::fs::filter::parser::Expr;

    use anyhow::Result;

    fn parse_(input: &str) -> Result<Expr> {
        Ok(parse(input).map(|pairs| convert(pairs))?)
    }

    #[test]
    fn pretty_byte() -> Result<()> {
        let tests = ["123.423GB", "1MB", "2.3PB"];

        for input in tests {
            assert_eq!(parse_(input)?, Expr::PrettyByte(input.to_string()));
        }

        Ok(())
    }

    #[test]
    fn aliases() -> Result<()> {
        let tests = [
            (
                "s and soft",
                Expr::Binary {
                    lhs: Box::new(Expr::Property(Property::Size)),
                    op: BinaryOperator::And,
                    rhs: Box::new(Expr::Word("soft".to_string())),
                },
            ),
            (
                "mansion or m",
                Expr::Binary {
                    lhs: Box::new(Expr::Word("mansion".to_string())),
                    op: BinaryOperator::Or,
                    rhs: Box::new(Expr::Property(Property::Modified)),
                },
            ),
        ];

        for (input, expected) in tests {
            assert_eq!(parse_(input)?, expected);
        }

        Ok(())
    }

    #[test]
    fn escaping() -> Result<()> {
        let tests = [
            ("'file'", Expr::Word("file".to_string())),
            ("'4.2GB'", Expr::Word("4.2GB".to_string())),
            ("'name'", Expr::Word("name".to_string())),
        ];

        for (input, expected) in tests {
            assert_eq!(parse_(input)?, expected)
        }

        Ok(())
    }

    #[test]
    fn bin_op() -> Result<()> {
        let tests = [
            (
                "something or $2023-11-09$ or 2.3MB",
                Expr::Binary {
                    lhs: Box::new(Expr::Binary {
                        lhs: Box::new(Expr::Word("something".to_string())),
                        op: BinaryOperator::Or,
                        rhs: Box::new(Expr::Date("2023-11-09".to_string())),
                    }),
                    op: BinaryOperator::Or,
                    rhs: Box::new(Expr::PrettyByte("2.3MB".to_string())),
                },
            ),
            (
                "something or $2023-11-09$",
                Expr::Binary {
                    lhs: Box::new(Expr::Word("something".to_string())),
                    op: BinaryOperator::Or,
                    rhs: Box::new(Expr::Date("2023-11-09".to_string())),
                },
            ),
            (
                "file and size < 2.3MB",
                Expr::Binary {
                    lhs: Box::new(Expr::Kind(Kind::File)),
                    op: BinaryOperator::And,
                    rhs: Box::new(Expr::Binary {
                        lhs: Box::new(Expr::Property(Property::Size)),
                        op: BinaryOperator::Lt,
                        rhs: Box::new(Expr::PrettyByte("2.3MB".to_string())),
                    }),
                },
            ),
            (
                "created < $2025-03-22$ and size > 2.3MB",
                Expr::Binary {
                    lhs: Box::new(Expr::Binary {
                        lhs: Box::new(Expr::Property(Property::Created)),
                        op: BinaryOperator::Lt,
                        rhs: Box::new(Expr::Date("2025-03-22".to_string())),
                    }),
                    op: BinaryOperator::And,
                    rhs: Box::new(Expr::Binary {
                        lhs: Box::new(Expr::Property(Property::Size)),
                        op: BinaryOperator::Gt,
                        rhs: Box::new(Expr::PrettyByte("2.3MB".to_string())),
                    }),
                },
            ),
        ];

        for (input, expected) in tests {
            assert_eq!(parse_(input)?, expected);
        }

        Ok(())
    }
}
