use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{self, BufReader, BufWriter};

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct IncomeEntry {
    pub source: String,
    pub amount: f64,
    pub date: String, 
    pub notes: Option<String>, 
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
        let file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(filename)?;
        let writer = BufWriter::new(file);
        serde_json::to_writer_pretty(writer, &self)?;
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
