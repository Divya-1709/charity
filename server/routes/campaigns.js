const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/campaigns - All active campaigns
router.get('/', async (req, res) => {
  try {
    const { category, status = 'active', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT c.*, u.name as admin_name,
      ROUND((c.raised_amount / NULLIF(c.goal_amount,0)) * 100, 2) as progress_percent
      FROM campaigns c LEFT JOIN users u ON c.admin_id = u.id WHERE 1=1`;
    const params = [];
    if (category) { params.push(category); query += ` AND c.category = $${params.length}`; }
    if (status) { params.push(status); query += ` AND c.status = $${params.length}`; }
    query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM campaigns WHERE status = $1', [status]);
    res.json({ campaigns: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name as admin_name,
       ROUND((c.raised_amount / NULLIF(c.goal_amount,0)) * 100, 2) as progress_percent
       FROM campaigns c LEFT JOIN users u ON c.admin_id = u.id WHERE c.id = $1`, [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Campaign not found.' });
    const updates = await pool.query(
      'SELECT * FROM campaign_updates WHERE campaign_id = $1 ORDER BY created_at DESC', [req.params.id]);
    const donors = await pool.query(
      `SELECT u.name, d.amount, d.donated_at, d.is_anonymous FROM donations d
       LEFT JOIN users u ON d.donor_id = u.id WHERE d.campaign_id = $1 ORDER BY d.donated_at DESC LIMIT 10`, [req.params.id]);
    res.json({ campaign: result.rows[0], updates: updates.rows, recentDonors: donors.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/campaigns - Admin creates campaign
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, category, goal_amount, image_url, start_date, end_date } = req.body;
    const result = await pool.query(
      `INSERT INTO campaigns (title, description, category, goal_amount, image_url, start_date, end_date, admin_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, description, category, goal_amount, image_url, start_date, end_date, req.user.id]
    );
    res.status(201).json({ message: 'Campaign created!', campaign: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/campaigns/:id - Admin updates campaign
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, category, goal_amount, image_url, start_date, end_date, status } = req.body;
    const result = await pool.query(
      `UPDATE campaigns SET title=$1, description=$2, category=$3, goal_amount=$4,
       image_url=$5, start_date=$6, end_date=$7, status=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [title, description, category, goal_amount, image_url, start_date, end_date, status, req.params.id]
    );
    res.json({ message: 'Campaign updated!', campaign: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/campaigns/:id/updates - Admin adds campaign update
router.post('/:id/updates', auth, adminOnly, async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO campaign_updates (campaign_id, title, content, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.params.id, title, content, image_url]
    );
    res.status(201).json({ update: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
