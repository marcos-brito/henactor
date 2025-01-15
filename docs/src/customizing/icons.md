# Icons

**Henactor** is shipped with it's own set of icons that come
from [Lucide](https://lucide.dev/). They are used by default and as
fallback when something goes wrong.

There are two categories of icons that are used across the application:

-   **UI icons:** General icons used mostly for buttons
-   **Rule icons:** Icons that are applied for a certain file or directory

Let's make some changes!

Create `icons.toml` under `$CONFIG/henactor/themes/$THEME` and copy this:

```toml
[ui]
directory = "flat-color-icons:folder"
file = "flat-color-icons:file"
link_to_dir = "lucide:folder-symlink:#FAC529"

[rules]
'application/json' = "vscode-icons:file-type-json"
'.*\.go' = "vscode-icons:file-type-go"

```

As you can see, there is a section for each icon category. Each item has a key followed by `=`
and then a value. Each value is what we call an _Icon String_. You should read [Icon String](./icons/icon-string.md) to learn more about.

In the `ui` section, the keys are predefined. You can find them all in [UI icons](./icons/ui-icons.md).

In the `rule` section, the keys can be either a `mimetype` or a `regex`. Rules are checked as the following in that same order:

-   If the `mimetype` of an file matches a key then that will be used as icon
-   If no match is found then every key will be considered as `regex` and the first one that matches will be used
-   If no regex matches then the icon defined for this kind of file in the `ui` section will be used
-   If no icon was specified there then the default will be used

The `regex` is checked against full paths instead of names.

> **Tip:** You can see the `mimetype` of a file by toggling the `Detailed kind` column in the list view. Not all of them have one though.
