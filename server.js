// Simple Express server that supports Postgres / MySQL / SQLite
const express = require('express');
const bodyParser = require('body-parser');

const DB_TYPE = process.env.DB_TYPE || 'postgres'; // 'postgres' | 'mysql' | 'sqlite'
const PORT = process.env.PORT || 3000;

let dbClient;
let queryPlaceholder = '$1'; // default for pg

async function initDb() {
  if (DB_TYPE === 'postgres') {
    const { Pool } = require('pg');
    dbClient = new Pool({ connectionString: process.env.DATABASE_URL });
    queryPlaceholder = (n) => '$' + n;
  } else if (DB_TYPE === 'mysql') {
    const mysql = require('mysql2/promise');
    dbClient = await mysql.createPool(process.env.DATABASE_URL);
    queryPlaceholder = () => '?';
  } else if (DB_TYPE === 'sqlite') {
    const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');
    dbClient = await open({ filename: process.env.SQLITE_FILE || './data.sqlite', driver: sqlite3.Database });
    queryPlaceholder = () => '?';
  } else {
    throw new Error('Unsupported DB_TYPE: ' + DB_TYPE);
  }
}

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// GET case studies (optionally filter by industry)
app.get('/case-studies', async (req, res) => {
  try {
    const industry = req.query.industry;
    if (DB_TYPE === 'postgres') {
      const params = [];
      let sql = 'SELECT * FROM case_studies WHERE published = true';
      if (industry) { params.push(industry); sql += ` AND industry = ${queryPlaceholder(params.length)}`; }
      sql += ' ORDER BY (key_metrics->>\'roi_pct\')::int DESC NULLS LAST LIMIT 50';
      const r = await dbClient.query(sql, params);
      return res.json(r.rows);
    } else if (DB_TYPE === 'mysql') {
      let sql = 'SELECT * FROM case_studies WHERE published = 1';
      const params = [];
      if (industry) { sql += ' AND industry = ?'; params.push(industry); }
      sql += ' ORDER BY CAST(JSON_EXTRACT(key_metrics, "$.roi_pct") AS UNSIGNED) DESC LIMIT 50';
      const [rows] = await dbClient.execute(sql, params);
      return res.json(rows);
    } else {
      // sqlite: no robust JSON ordering - parse later
      let rows = await dbClient.all('SELECT * FROM case_studies WHERE published = 1' + (industry ? ' AND industry = ?' : ''), industry ? [industry] : []);
      rows = rows.map(r => { try { r.key_metrics = JSON.parse(r.key_metrics); } catch (e) { r.key_metrics = {}; } return r; });
      rows.sort((a,b)=> (b.key_metrics.roi_pct||0) - (a.key_metrics.roi_pct||0));
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET recommendations (top 3) for given industry/pain_point
app.get('/recommendations', async (req, res) => {
  const industry = req.query.industry;
  try {
    // reuse case-studies endpoint behavior
    const resp = await fetchRecommendations(industry);
    res.json(resp.slice(0,3));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function fetchRecommendations(industry) {
  if (DB_TYPE === 'postgres') {
    const params = [];
    let sql = 'SELECT * FROM case_studies WHERE published = true';
    if (industry) { params.push(industry); sql += ` AND industry = ${queryPlaceholder(params.length)}`; }
    sql += ' ORDER BY (key_metrics->>\'roi_pct\')::int DESC NULLS LAST LIMIT 10';
    const r = await dbClient.query(sql, params);
    return r.rows;
  } else if (DB_TYPE === 'mysql') {
    let sql = 'SELECT * FROM case_studies WHERE published = 1';
    const params = [];
    if (industry) { sql += ' AND industry = ?'; params.push(industry); }
    sql += ' ORDER BY CAST(JSON_EXTRACT(key_metrics, "$.roi_pct") AS UNSIGNED) DESC LIMIT 10';
    const [rows] = await dbClient.execute(sql, params);
    return rows;
  } else {
    let rows = await dbClient.all('SELECT * FROM case_studies WHERE published = 1' + (industry ? ' AND industry = ?' : ''), industry ? [industry] : []);
    rows = rows.map(r => { try { r.key_metrics = JSON.parse(r.key_metrics); } catch (e) { r.key_metrics = {}; } return r; });
    rows.sort((a,b)=> (b.key_metrics.roi_pct||0) - (a.key_metrics.roi_pct||0));
    return rows;
  }
}

// Create lead
app.post('/leads', async (req, res) => {
  const { name, email, phone, company, industry, size_category, pain_points } = req.body;
  try {
    if (DB_TYPE === 'postgres') {
      const sql = `INSERT INTO leads (name,email,phone,company,industry,size_category,pain_points,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,now()) RETURNING *`;
      const r = await dbClient.query(sql, [name,email,phone,company,industry,size_category,pain_points]);
      return res.json(r.rows[0]);
    } else if (DB_TYPE === 'mysql') {
      const sql = 'INSERT INTO leads (name,email,phone,company,industry,size_category,pain_points) VALUES (?,?,?,?,?,?,?)';
      const [result] = await dbClient.execute(sql, [name,email,phone,company,industry,size_category,pain_points]);
      const [rows] = await dbClient.execute('SELECT * FROM leads WHERE id = ?', [result.insertId]);
      return res.json(rows[0]);
    } else {
      const stmt = await dbClient.run('INSERT INTO leads (name,email,phone,company,industry,size_category,pain_points) VALUES (?,?,?,?,?,?,?)', [name,email,phone,company,industry,size_category,pain_points]);
      const lead = await dbClient.get('SELECT * FROM leads WHERE id = ?', [stmt.lastID]);
      return res.json(lead);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

initDb().then(()=>{
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}, DB_TYPE=${DB_TYPE}`));
}).catch(err=>{
  console.error('DB init failed', err);
  process.exit(1);
});
