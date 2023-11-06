use crate::config::Fonts;

pub fn default_fonts() -> Fonts {
    let default_fonts = Fonts {
        font: "JetBrains Mono".to_string(),
        small_text: ".75rem".to_string(),
        regular_text: "1rem".to_string(),
        big_text: "1.25rem".to_string(),
        regular_title: "2rem".to_string(),
        big_title: "2.5rem".to_string(),
    };

    default_fonts
}
