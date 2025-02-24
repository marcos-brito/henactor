# Filtering

**Henactor** allows you to filter entries inside the current directory. It gives access to a small, simple and yet powerful
language to write expressions that are evaluated to filters.

> If you are into that, check the [grammar](https://github.com/marcos-brito/henactor/tree/main/src-tauri/src/fs/filter.pest)!

Roughly what happens is that every entry has it's [Properties] checked against the expression, which always evaluate to a boolean value (either true or false). If it yields true then you'll see it in your explorer. If not, it will be hidden.

# The language

This little language we spoke about is very short and has only a few kinds of objects and operators. Because of the few checks that are made, you gain a lot of flexibility to write anything, but this come with an eventual hard time trying to understand why you see something that is expected to not be there (or the other way around).

## Objects

These objects represent all values that you can use in your expression. They can be combined
with operators, but they also have a "default" value when used alone. `created = $05/04/2031$` is the same as `$05/04/2031$`.

### Word

It's a text with no special meaning. Such as `potato` or `tomato`.

` secret or "public"` is the same as `name = secret or name = "public"`.

You can use `"` for words if you like or if you want something with special meaning to be escaped.

### Date

Dates should always be surrounded by `$`. They should also be formatted like the following.

-   `2018-02-14 00:28:07`
-   `2018-02-14`

`name = file and $2023-03-22$` is the same as `name = file and created = $2023-03-22$`

### Regex

Just like _Dates_ regular expressions should also be surrounded, but `/` should be used instead.

-   `/.*\.log$/`
-   `/.log/`

`/.log/` is the same as `name = /.log/` or `path = /.log/`.

### Kind

Kind can be one of

-   `link` or `l`
-   `directory` or `d`
-   `file` or `f`

If you want the literal value you should surround it with `"`. `file` is diferent from `"file"`.

`link and name = "file"` is the same as `kind = link and name = "file"`

### Pretty byte

It's a floating point or integer number followed by a size. This is what you can use:

-   `B` for bytes
-   `GB` for gigabytes
-   `GIB` for gibibytes
-   `KB` for kilobytes
-   `KIB` for kibibytes
-   `MB` for megabytes
-   `MIB` for mebibyte
-   `PB` for petabytes
-   `PIB` for pebibytes
-   `TB` for terabytes
-   `TIB` for tebibytes

Again, you can escape it's meaning surrounding it with `"`.

`3.2MB and kind = file` is the same as `size = 3.2MB and kind = file`

## Operators

## Properties

Every entry, either a file or directory, has a few properties that are "Filterable". Each of these can be
compared with some of the objects you just read about.

-   `name`
-   `path`
-   `kind`
-   `size`
-   `created`
-   `modified`: Last modification date
-   `accessed`: Last access date

You're felling lazy you can type just the first letter of a property. `name` is the same as `n`.
