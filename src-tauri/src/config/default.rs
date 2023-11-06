pub mod color_scheme;
mod fonts;
mod icons;
mod pins;

use super::ConfigGenerator;
use crate::utils;
use std::env;

pub struct DefaultConfig<'a> {
    config_generator: &'a ConfigGenerator,
}

// This might have a nice little coupling. Be careful.
impl<'a> DefaultConfig<'a> {
    pub fn new(config_generator: &'a ConfigGenerator) -> Self {
        Self { config_generator }
    }

    fn default_color_scheme(&self) -> () {
        let pallete = color_scheme::default_color_scheme();
        self.config_generator
            .add_config_file("appearence/default/theme.json", &pallete);
    }

    fn default_fonts(&self) -> () {
        let fonts = fonts::default_fonts();
        self.config_generator
            .add_config_file("appearence/default/fonts.json", &fonts);
    }

    fn default_icons(&self) -> () {
        let icons = icons::default_icons("./icons");
        self.config_generator
            .add_config_file("appearence/default/icons.json", &icons);
    }

    fn default_pins(&self) -> () {
        let pins = pins::defaults_pins();
        self.config_generator.add_config_file("pins.json", &pins);
    }

    fn copy_icons_to_config_dir(&self) -> () {
        let dst = self
            .config_generator
            .config_dir_path
            .join("appearence/default/icons")
            .to_string_lossy()
            .to_string();
        let src = env::current_dir()
            .unwrap()
            .join("default_icons")
            .to_string_lossy()
            .to_string();
        utils::dir_copy(&src, &dst);
    }

    pub fn generate(&self) -> () {
        self.config_generator.add_sub_dir("appearence");
        self.config_generator.add_sub_dir("appearence/default");
        self.config_generator
            .add_sub_dir("appearence/default/icons");
        self.default_color_scheme();
        self.default_fonts();
        self.default_icons();
        self.copy_icons_to_config_dir();
        self.default_pins();
    }
}
