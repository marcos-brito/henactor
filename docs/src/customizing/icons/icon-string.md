## Icon String

An **Icon String** is nothing but a text used to represent an icon. It follows
a certain format and can be any of the following.

### Absolute Path

A file system path starting at the root directory. That is `/` if you are in a
UNIX based system or `\` on Windows.

-   `/path/to/an/icon.png`

### Relative Path

A file system path starting at `./` or `../`. In our context, they
are resolved by joining it with the absolute path of the theme you're editing.

-   `./icon.png` -> `/my/config/henactor/themes/mytheme/icon.png`
-   `../icon.png` -> `/my/config/henactor/themes/icon.png`

### URL

Any valid URL. Usually, it start with `https`, but in theory it can be any protocol
the `<img>` tag supports and that is allowed by **Henactor's** `CSP` options.

-   `https://a.com/icon.pgn`
-   `ftp://a.com/icon.pgn`

### Iconify

A text following the format of `prefix:icon:color` where

-   `prefix` is an icon set, such as `vscode-icons` or `tabler`
-   `icon` is an icon under that set, such as `file-type-go` or `10k`
-   `color` is hex color, such as `#000` or `#FFFFFF`. This one is optional and you can omit
    the whole `:color`

This is "translated" to a resource under `https://api.iconify.design` which is as
service that provides unified access to many open-source icon sets. You can
browse it [here](https://icon-sets.iconify.design/).

> Check them out! [Iconify](https://iconify.design/)

-   `lucide:folder-symlink:#FAC529`
-   `vscode-icons:file-type-ocaml`

### Literal

A regular text with no special meaning. It follows the format of `literal:color` where
`literal` is any text such as `pdf` or `yaml` and `color` is an optional hex color such as `#BE23aF` or `#FFAB32`

-   `pdf;#8839ef`
-   `yaml`
