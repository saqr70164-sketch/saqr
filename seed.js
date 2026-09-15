// seed.js - simple seeder for PostgreSQL using DATABASE_URL
const fs = require('fs');
const { Client } = require('pg');

async function run() {
  const sql = fs.readFileSync('seed.sql', 'utf8');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Please set DATABASE_URL environment variable. Example: postgres://user:pass@host:5432/dbname');
    process.exit(1);
  }
  const client = new Client({ connectionString });
  try {
    await client.connect();
    // run the file as a single query - Postgres supports multiple statements
    await client.query(sql);
    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
