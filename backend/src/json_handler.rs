use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, BufReader};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct IncomeEntry {
    pub source: String,
    pub amount: f64,
    pub date: String, // Use a proper date type in a real application
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct IncomeData {
    pub entries: Vec<IncomeEntry>,
}

impl IncomeData {
    pub fn load_from_file(filename: &str) -> io::Result<IncomeData> {
        let file = File::open(filename)?;
        let reader = BufReader::new(file);
        let data = serde_json::from_reader(reader)?;
        Ok(data)
    }

    pub fn save_to_file(&self, filename: &str) -> io::Result<()> {
        let file = File::create(filename)?;
        serde_json::to_writer_pretty(file, &self)?;
        Ok(())
    }

    pub fn add_entry(&mut self, entry: IncomeEntry) {
        self.entries.push(entry);
    }

    pub fn update_entry(&mut self, index: usize, entry: IncomeEntry) {
        if let Some(e) = self.entries.get_mut(index) {
            *e = entry;
        }
    }

    pub fn delete_entry(&mut self, index: usize) {
        if index < self.entries.len() {
            self.entries.remove(index);
        }
    }
}
