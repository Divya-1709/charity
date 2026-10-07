require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const schema = fs.readFileSync('./db/schema.sql', 'utf8');

pool.query(schema)
  .then(() => {
    console.log('✅ Schema applied to Neon successfully!');
    return pool.end();
  })
  .catch(err => {
    console.error('❌ Schema error:', err.message);
    return pool.end();
  });
