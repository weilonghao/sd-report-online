'use strict';

const records = [];

function clearAll() {
  records.length = 0;
}

function insertRecords(newRecords) {
  records.push(...newRecords);
}

function getAllRecords() {
  return records.map(r => ({ ...r }));
}

function getRecordCount() {
  return records.length;
}

function getStats() {
  const total = records.length;
  const white = records.filter(r => r.shift === '白班').length;
  const night = records.filter(r => r.shift === '夜班').length;
  const drivers = new Set(records.map(r => r.driver)).size;
  const days = new Set(records.map(r => r.date)).size;
  const tasks = new Set(records.filter(r => r.task && r.task !== '未知任务').map(r => r.task)).size;
  return { total, white, night, drivers, days, tasks };
}

function getDistinctValues(field) {
  const allowed = ['driver', 'car_number', 'task', 'source', 'location', 'date'];
  if (!allowed.includes(field)) return [];
  const vals = records
    .map(r => r[field])
    .filter(v => v && v !== '');
  return [...new Set(vals)].sort();
}

module.exports = {
  clearAll,
  insertRecords,
  getAllRecords,
  getRecordCount,
  getStats,
  getDistinctValues,
};
