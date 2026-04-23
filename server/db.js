'use strict';

const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'report.db');

let db = null;

function getDb() {
  if (db) return db;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const Database = require('better-sqlite3');
    db = new Database(DB_PATH);

    db.exec(`
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        task TEXT NOT NULL,
        driver TEXT NOT NULL,
        car_number TEXT DEFAULT '',
        shift TEXT NOT NULL,
        departure_time TEXT DEFAULT '',
        source TEXT DEFAULT '',
        total_collection REAL DEFAULT 0,
        effective_time REAL DEFAULT 0,
        location TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now', 'localtime'))
      );

      CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
      CREATE INDEX IF NOT EXISTS idx_records_driver ON records(driver);
      CREATE INDEX IF NOT EXISTS idx_records_task ON records(task);
      CREATE INDEX IF NOT EXISTS idx_records_source ON records(source);
    `);

    console.log(`[DB] SQLite initialized at ${DB_PATH}`);
    return db;
  } catch (err) {
    console.error('[DB] Failed to initialize SQLite:', err);
    throw err;
  }
}

function clearAll() {
  try {
    getDb().exec('DELETE FROM records');
    console.log('[DB] All records cleared');
  } catch (err) {
    console.error('[DB] clearAll failed:', err);
    throw err;
  }
}

function insertRecords(newRecords) {
  if (!newRecords || newRecords.length === 0) return;

  try {
    const database = getDb();
    const stmt = database.prepare(`
      INSERT INTO records (date, task, driver, car_number, shift, departure_time, source, total_collection, effective_time, location)
      VALUES (@date, @task, @driver, @car_number, @shift, @departure_time, @source, @total_collection, @effective_time, @location)
    `);

    const insertMany = database.transaction((records) => {
      for (const r of records) {
        stmt.run({
          date: r.date || '',
          task: r.task || '',
          driver: r.driver || '',
          car_number: r.car_number || '',
          shift: r.shift || '',
          departure_time: r.departure_time || '',
          source: r.source || '',
          total_collection: r.total_collection || 0,
          effective_time: r.effective_time || 0,
          location: r.location || '',
        });
      }
    });

    insertMany(newRecords);
    console.log(`[DB] Inserted ${newRecords.length} records`);
  } catch (err) {
    console.error('[DB] insertRecords failed:', err);
    throw err;
  }
}

function getAllRecords() {
  try {
    const rows = getDb().prepare('SELECT * FROM records ORDER BY date ASC, departure_time ASC').all();
    return rows.map(r => ({ ...r }));
  } catch (err) {
    console.error('[DB] getAllRecords failed:', err);
    throw err;
  }
}

function getRecordCount() {
  try {
    const row = getDb().prepare('SELECT COUNT(*) as count FROM records').get();
    return row.count;
  } catch (err) {
    console.error('[DB] getRecordCount failed:', err);
    return 0;
  }
}

function getStats() {
  try {
    const database = getDb();
    const total = database.prepare('SELECT COUNT(*) as n FROM records').get().n;
    const white = database.prepare("SELECT COUNT(*) as n FROM records WHERE shift = '白班'").get().n;
    const night = database.prepare("SELECT COUNT(*) as n FROM records WHERE shift = '夜班'").get().n;
    const drivers = database.prepare('SELECT COUNT(DISTINCT driver) as n FROM records').get().n;
    const days = database.prepare('SELECT COUNT(DISTINCT date) as n FROM records').get().n;
    const tasks = database.prepare("SELECT COUNT(DISTINCT task) as n FROM records WHERE task IS NOT NULL AND task != '未知任务' AND task != ''").get().n;
    return { total, white, night, drivers, days, tasks };
  } catch (err) {
    console.error('[DB] getStats failed:', err);
    throw err;
  }
}

function getDistinctValues(field) {
  const allowed = ['driver', 'car_number', 'task', 'source', 'location', 'date'];
  if (!allowed.includes(field)) return [];
  try {
    const rows = getDb()
      .prepare(`SELECT DISTINCT ${field} as val FROM records WHERE ${field} IS NOT NULL AND ${field} != '' ORDER BY ${field}`)
      .all();
    return rows.map(r => r.val);
  } catch (err) {
    console.error(`[DB] getDistinctValues(${field}) failed:`, err);
    return [];
  }
}

module.exports = {
  clearAll,
  insertRecords,
  getAllRecords,
  getRecordCount,
  getStats,
  getDistinctValues,
};
