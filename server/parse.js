'use strict';

const EXCLUDE_PATTERNS = [];
const TIME_RE = /(\d{1,2})[：:](\d{2})/g;
const DATE_RE = /^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})/;

function parseCSVText(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) && !inQuotes) {
      if (current.trim() !== '') rows.push(current);
      current = '';
      if (ch === '\r') i++;
    } else {
      current += ch;
    }
  }
  if (current.trim() !== '') rows.push(current);
  return rows;
}

function splitCSVLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function findCol(headers, names) {
  for (let hi = 0; hi < headers.length; hi++) {
    const normalized = headers[hi].replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
    for (const n of names) {
      if (normalized.includes(n)) return hi;
    }
  }
  return -1;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr.toString().trim() === '') return null;
  const m = DATE_RE.exec(dateStr.toString().trim());
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  return null;
}

function parseTime(timeStr) {
  if (!timeStr || timeStr.toString().trim() === '') return [];
  const normalized = timeStr.toString().replace(/：/g, ':');
  const matches = [...normalized.matchAll(TIME_RE)];
  const result = [];
  for (const match of matches) {
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      result.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return result;
}

function isValidDriver(val) {
  if (!val || val.toString().trim() === '') return false;
  const s = val.toString().trim();
  for (const kw of EXCLUDE_PATTERNS) {
    if (s.includes(kw)) return false;
  }
  if (/^[\d\.\s日号,，]+$/.test(s)) return false;
  return true;
}

function parseCapacity(val) {
  if (!val || val.toString().trim() === '') return 0;
  let s = val.toString().toUpperCase().trim().replace(/G|T|％|%/g, '').replace(/T/g, '').trim();
  try {
    if (val.toString().toUpperCase().includes('T')) return parseFloat(s) * 1000;
    return parseFloat(s);
  } catch (e) { return 0; }
}

function inferFileName(filepath) {
  const name = filepath.replace(/\.csv$/i, '').trim();
  let location = '未知';
  if (name.includes('青岛&临沂')) location = '青岛&临沂';
  else if (name.includes('青岛黄岛')) location = '青岛_黄岛';
  else if (name.includes('青岛')) location = '青岛_城阳';
  else if (name.includes('临沂')) location = '临沂';

  const m = name.match(/[（(]([^）)]+)[）)]/);
  const device = m ? m[1].trim() : '未知设备';

  return `${location}_${device}`;
}

function parseSingleFile(csvText, sourceName) {
  const lines = parseCSVText(csvText);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[1]);

  const colDate    = findCol(headers, ['时间']);
  const colTask    = findCol(headers, ['采集任务']);
  const colCar     = findCol(headers, ['车号']);
  const colDriver  = findCol(headers, ['出车人SD']);
  const colTime    = findCol(headers, ['出车时间']);
  const colTotal   = findCol(headers, ['采集总容量']);
  const colEff     = findCol(headers, ['有效采集时间']);

  let currentDate = null;
  let currentTask = null;
  const records = [];

  for (let i = 2; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    if (cells.length === 0 || cells.every(c => c === '')) continue;

    if (colDate >= 0 && colDate < cells.length) {
      const parsed = parseDate(cells[colDate]);
      if (parsed) {
        currentDate = parsed;
        currentTask = null;
      }
    }
    if (!currentDate) continue;

    if (colTask >= 0 && colTask < cells.length) {
      const tv = cells[colTask];
      if (tv && tv.trim() !== '') currentTask = tv.trim();
    }

    if (colDriver < 0 || colTime < 0) continue;
    if (colDriver >= cells.length || colTime >= cells.length) continue;
    const driverRaw = cells[colDriver];
    const timeRaw = cells[colTime];
    if (!driverRaw || driverRaw.trim() === '' || !timeRaw || timeRaw.trim() === '') continue;
    if (!isValidDriver(driverRaw)) continue;

    const times = parseTime(timeRaw);
    if (times.length === 0) continue;

    const totalCol = (colTotal >= 0 && colTotal < cells.length) ? parseCapacity(cells[colTotal]) : 0;
    let effTime = 0;
    if (colEff >= 0 && colEff < cells.length) {
      const v = parseFloat(cells[colEff]);
      if (!isNaN(v)) effTime = v;
    }

    const driverNames = driverRaw.split('/').map(d => d.trim()).filter(d => d);
    const numDrivers = driverNames.length;
    const numTimes = times.length;

    for (let di = 0; di < driverNames.length; di++) {
      let assignedTime;
      if (numDrivers >= numTimes) {
        assignedTime = times[Math.min(di, numTimes - 1)];
      } else {
        if (di < numDrivers - 1) assignedTime = times[di];
        else assignedTime = times[numTimes - 1];
      }
      const shift = parseInt(assignedTime.split(':')[0]) >= 19 ? '夜班' : '白班';
      const carNum = (colCar >= 0 && colCar < cells.length) ? cells[colCar] : '';

      records.push({
        date: `${String(currentDate[0]).padStart(4, '0')}-${String(currentDate[1]).padStart(2, '0')}-${String(currentDate[2]).padStart(2, '0')}`,
        task: currentTask || '未知任务',
        driver: driverNames[di],
        car_number: carNum || '',
        shift,
        departure_time: assignedTime,
        source: sourceName,
        total_collection: totalCol,
        effective_time: effTime,
        location: sourceName,
      });
    }
  }
  return records;
}

function parseUpload(files) {
  const results = [];
  for (const file of files) {
    if (!file.originalname || !file.originalname.toLowerCase().endsWith('.csv')) continue;
    const sourceName = inferFileName(file.originalname);
    const records = parseSingleFile(file.buffer.toString('utf-8'), sourceName);
    results.push({ filename: file.originalname, name: sourceName, count: records.length, records });
  }
  return results;
}

module.exports = { parseSingleFile, parseUpload };
