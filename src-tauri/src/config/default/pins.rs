use crate::pins::PinnedItem;

pub fn defaults_pins() -> Vec<PinnedItem> {
    let mut pins: Vec<PinnedItem> = Vec::new();
    let home = PinnedItem::new("Home", "/home/marcos-brito", "🏚️");
    let documents = PinnedItem::new("Documents", "/home/marcos-brito/Documents", "🗒️");

    pins.push(home);
    pins.push(documents);

    pins
}
