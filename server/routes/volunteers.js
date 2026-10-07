const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, adminOnly, roles } = require('../middleware/auth');

// GET /api/volunteers/opportunities - Browse opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const { category, status = 'open' } = req.query;
    let query = `SELECT v.*, u.name as admin_name FROM volunteer_opportunities v
                 LEFT JOIN users u ON v.admin_id=u.id WHERE 1=1`;
    const params = [];
    if (category) { params.push(category); query += ` AND v.category=$${params.length}`; }
    if (status) { params.push(status); query += ` AND v.status=$${params.length}`; }
    query += ' ORDER BY v.event_date ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/volunteers/opportunities/:id
router.get('/opportunities/:id', async (req, res) => {
  try {
    const opp = await pool.query('SELECT * FROM volunteer_opportunities WHERE id=$1', [req.params.id]);
    if (!opp.rows[0]) return res.status(404).json({ message: 'Opportunity not found.' });
    res.json(opp.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/volunteers/opportunities - Admin creates opportunity
router.post('/opportunities', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, category, location, event_date, event_time, slots_available, requirements } = req.body;
    const result = await pool.query(
      `INSERT INTO volunteer_opportunities (title, description, category, location, event_date, event_time, slots_available, requirements, admin_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, description, category, location, event_date, event_time, slots_available, requirements, req.user.id]
    );
    res.status(201).json({ opportunity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/volunteers/apply/:id - Volunteer applies
router.post('/apply/:id', auth, roles('volunteer'), async (req, res) => {
  try {
    const opp = await pool.query('SELECT * FROM volunteer_opportunities WHERE id=$1 AND status=$2', [req.params.id, 'open']);
    if (!opp.rows[0]) return res.status(404).json({ message: 'Opportunity not found or closed.' });
    if (opp.rows[0].slots_filled >= opp.rows[0].slots_available) {
      return res.status(400).json({ message: 'No slots available.' });
    }
    const result = await pool.query(
      'INSERT INTO volunteer_applications (volunteer_id, opportunity_id) VALUES ($1,$2) RETURNING *',
      [req.user.id, req.params.id]
    );
    res.status(201).json({ message: 'Application submitted!', application: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Already applied for this opportunity.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/volunteers/my-applications - Volunteer's applications
router.get('/my-applications', auth, roles('volunteer', 'admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT va.*, vo.title, vo.category, vo.location, vo.event_date, vo.event_time
       FROM volunteer_applications va LEFT JOIN volunteer_opportunities vo ON va.opportunity_id=vo.id
       WHERE va.volunteer_id=$1 ORDER BY va.applied_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/volunteers/applications/:id - Admin approve/reject
router.put('/applications/:id', auth, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    let query = `UPDATE volunteer_applications SET status=$1, notes=$2 WHERE id=$3 RETURNING *`;
    const params = [status, notes, req.params.id];
    if (status === 'completed') {
      query = `UPDATE volunteer_applications SET status=$1, notes=$2, completed_at=NOW() WHERE id=$3 RETURNING *`;
    }
    const result = await pool.query(query, params);
    if (status === 'completed') {
      const app = result.rows[0];
      await pool.query('UPDATE volunteer_opportunities SET slots_filled = slots_filled + 1 WHERE id=$1', [app.opportunity_id]);
      // Issue certificate notification
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES ($1,$2,$3,$4)`,
        [app.volunteer_id, 'Volunteer Certificate Ready!', 'Congratulations! Your volunteer activity has been completed. Download your certificate.', 'certificate']
      );
    }
    res.json({ application: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/volunteers/admin/all - Admin view all applications
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT va.*, u.name as volunteer_name, u.email as volunteer_email, vo.title as opportunity_title
       FROM volunteer_applications va LEFT JOIN users u ON va.volunteer_id=u.id
       LEFT JOIN volunteer_opportunities vo ON va.opportunity_id=vo.id
       ORDER BY va.applied_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
