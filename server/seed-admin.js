require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seedAdmin() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);

  // Delete existing admin if any
  await pool.query("DELETE FROM users WHERE email = 'admin@hopebridge.org'");

  // Insert fresh admin
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, is_verified, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role`,
    ['Admin', 'admin@hopebridge.org', hash, 'admin', true, true]
  );

  console.log('✅ Admin user created:', result.rows[0]);
  await pool.end();
}

seedAdmin().catch(err => {
  console.error('❌ Seed error:', err.message);
  pool.end();
});
