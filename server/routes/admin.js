const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [users, campaigns, donations, helpReqs, volunteers] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, role FROM users GROUP BY role'),
      pool.query(`SELECT COUNT(*) as total, status FROM campaigns GROUP BY status`),
      pool.query(`SELECT COUNT(*) as total, SUM(amount) as total_amount FROM donations WHERE status='completed'`),
      pool.query('SELECT COUNT(*) as total, status FROM help_requests GROUP BY status'),
      pool.query('SELECT COUNT(*) as total, status FROM volunteer_applications GROUP BY status'),
    ]);
    const monthly = await pool.query(
      `SELECT DATE_TRUNC('month', donated_at) as month, SUM(amount) as total
       FROM donations WHERE status='completed' AND donated_at >= NOW() - INTERVAL '6 months'
       GROUP BY month ORDER BY month`
    );
    res.json({
      users: users.rows,
      campaigns: campaigns.rows,
      donations: donations.rows[0],
      helpRequests: helpReqs.rows,
      volunteers: volunteers.rows,
      monthlyDonations: monthly.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/users - Manage users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT id, name, email, role, phone, is_verified, is_active, created_at FROM users WHERE 1=1';
    const params = [];
    if (role) { params.push(role); query += ` AND role=$${params.length}`; }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    const total = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ users: result.rows, total: parseInt(total.rows[0].count) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/admin/users/:id - Update user (verify, deactivate)
router.put('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const { is_verified, is_active } = req.body;
    const result = await pool.query(
      `UPDATE users SET is_verified=$1, is_active=$2, updated_at=NOW() WHERE id=$3
       RETURNING id, name, email, role, is_verified, is_active`,
      [is_verified, is_active, req.params.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deactivated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/reports
router.get('/reports', auth, adminOnly, async (req, res) => {
  try {
    const [topCampaigns, topDonors, categoryBreakdown] = await Promise.all([
      pool.query(`SELECT c.title, c.raised_amount, c.goal_amount, COUNT(d.id) as donation_count
                  FROM campaigns c LEFT JOIN donations d ON c.id=d.campaign_id
                  GROUP BY c.id ORDER BY c.raised_amount DESC LIMIT 5`),
      pool.query(`SELECT u.name, u.email, SUM(d.amount) as total_donated, COUNT(d.id) as donation_count
                  FROM donations d LEFT JOIN users u ON d.donor_id=u.id
                  WHERE d.is_anonymous=false GROUP BY u.id ORDER BY total_donated DESC LIMIT 10`),
      pool.query(`SELECT category, COUNT(*) as count, SUM(amount_needed) as total_needed
                  FROM help_requests GROUP BY category ORDER BY count DESC`),
    ]);
    res.json({ topCampaigns: topCampaigns.rows, topDonors: topDonors.rows, categoryBreakdown: categoryBreakdown.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
