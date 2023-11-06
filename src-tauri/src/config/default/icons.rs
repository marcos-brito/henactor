use crate::config::Icons;

pub fn default_icons(path: &str) -> Icons {
    let default_icons = Icons {
        directory: path.to_owned() + "/directory.svg",
        file: path.to_owned() + "/file.svg",
        settings: path.to_owned() + "/settings.svg",
        view: path.to_owned() + "/view.svg",
        sort: path.to_owned() + "/sort.svg",
        filter: path.to_owned() + "/filter.svg",
        search: path.to_owned() + "/search.svg",
        close: path.to_owned() + "/close.svg",
        add: path.to_owned() + "/add.svg",
    };

    default_icons
}
