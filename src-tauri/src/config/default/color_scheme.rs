use crate::config::Colors;
use crate::config::Pallete;

pub fn default_color_scheme() -> Pallete {
    let default_colors = Colors {
        red: "#eb564e".to_string(),
        blue: "#458588".to_string(),
        green: "#689d6a".to_string(),
        yellow: "#e78a4e".to_string(),
        purple: "#b16286".to_string(),
    };

    let default_color_scheme = Pallete {
        background_dark: "#1e1e1e".to_string(),
        background_light: "#202020".to_string(),
        highlight: "#3f3f3f".to_string(),
        text_dark: "#ddc7a1".to_string(),
        text_light: "#808480".to_string(),
        accent: "#689d6a".to_string(),
        colors: default_colors,
    };

    default_color_scheme
}
