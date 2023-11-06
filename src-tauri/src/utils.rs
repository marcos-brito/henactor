use std::fs;
use std::path::Path;

// TODO: Error handling
pub fn dir_copy(source: &str, destination: &str) -> () {
    let source = Path::new(source);
    let destination = Path::new(destination);
    let dir_entrys = fs::read_dir(source).unwrap();

    for entry in dir_entrys {
        let entry = entry.unwrap();

        fs::write(
            destination.join(entry.file_name()),
            fs::read(entry.path()).unwrap(),
        )
        .unwrap();
    }
}

#[allow(unused)]
pub fn vec_holds_another<T>(holder: &Vec<T>, sub: &Vec<T>) -> bool
where
    T: PartialEq,
{
    for item in sub {
        if !holder.contains(item) {
            return false;
        }
    }
    true
}
