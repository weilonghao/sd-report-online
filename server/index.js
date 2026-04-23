'use strict';

const express = require('express');
const path = require('path');
const multer = require('multer');
const { parseUpload } = require('./parse');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 CSV 文件'), false);
    }
  },
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/records', (req, res) => {
  try {
    const records = db.getAllRecords();
    res.json({ records, total: records.length });
  } catch (err) {
    console.error('Failed to get records:', err);
    res.status(500).json({ error: '获取数据失败', detail: err.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Failed to get stats:', err);
    res.status(500).json({ error: '获取统计数据失败', detail: err.message });
  }
});

app.get('/api/filters', (req, res) => {
  try {
    const drivers = db.getDistinctValues('driver');
    const cars = db.getDistinctValues('car_number');
    const tasks = db.getDistinctValues('task');
    const sources = db.getDistinctValues('source');
    const dates = db.getDistinctValues('date');
    res.json({ drivers, cars, tasks, sources, dates });
  } catch (err) {
    console.error('Failed to get filter options:', err);
    res.status(500).json({ error: '获取筛选选项失败', detail: err.message });
  }
});

app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '未提供文件' });
    }

    const parseResults = parseUpload(req.files);

    if (parseResults.length === 0) {
      return res.status(400).json({ error: '没有有效的CSV文件' });
    }

    db.clearAll();

    let totalRecords = 0;
    const details = [];
    for (const result of parseResults) {
      db.insertRecords(result.records);
      totalRecords += result.count;
      details.push({ name: result.name, count: result.count });
    }

    console.log(`[${new Date().toISOString()}] Uploaded ${totalRecords} records from ${parseResults.length} file(s)`);

    res.json({
      success: true,
      total: totalRecords,
      files: details,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: '上传失败', detail: err.message });
  }
});

app.delete('/api/records', (req, res) => {
  try {
    db.clearAll();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ error: '删除失败', detail: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`SD Report Server running on port ${PORT}`);
  console.log(`  Dashboard: http://localhost:${PORT}/report.html`);
  console.log(`  Upload:    http://localhost:${PORT}/admin.html`);
});
