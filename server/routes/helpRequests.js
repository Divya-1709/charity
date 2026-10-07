const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, adminOnly, roles } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/documents/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/help-requests - Beneficiary submits request
router.post('/', auth, roles('beneficiary'), upload.single('document'), async (req, res) => {
  try {
    const { title, description, category, urgency, amount_needed } = req.body;
    const document_url = req.file ? `/uploads/documents/${req.file.filename}` : null;
    const result = await pool.query(
      `INSERT INTO help_requests (beneficiary_id, title, description, category, urgency, amount_needed, document_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, title, description, category, urgency || 'medium', amount_needed || null, document_url]
    );
    res.status(201).json({ message: 'Help request submitted!', request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/help-requests/my - Beneficiary's requests
router.get('/my', auth, roles('beneficiary', 'admin'), async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? `SELECT hr.*, u.name as beneficiary_name, u.email as beneficiary_email FROM help_requests hr LEFT JOIN users u ON hr.beneficiary_id=u.id ORDER BY hr.created_at DESC`
      : `SELECT * FROM help_requests WHERE beneficiary_id=$1 ORDER BY created_at DESC`;
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/help-requests/admin/all - Admin views all requests
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = `SELECT hr.*, u.name as beneficiary_name, u.email as beneficiary_email, u.phone as beneficiary_phone
                 FROM help_requests hr LEFT JOIN users u ON hr.beneficiary_id=u.id WHERE 1=1`;
    const params = [];
    if (status) { params.push(status); query += ` AND hr.status=$${params.length}`; }
    if (category) { params.push(category); query += ` AND hr.category=$${params.length}`; }
    query += ' ORDER BY hr.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/help-requests/:id/review - Admin approves/rejects
router.put('/:id/review', auth, adminOnly, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const validStatuses = ['under_review', 'approved', 'rejected', 'fulfilled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const result = await pool.query(
      `UPDATE help_requests SET status=$1, admin_notes=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [status, admin_notes, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Request not found.' });
    // Notify beneficiary
    const hr = result.rows[0];
    const statusMessages = {
      under_review: 'Your help request is being reviewed by our team.',
      approved: 'Great news! Your help request has been approved.',
      rejected: 'Unfortunately, your help request was not approved at this time.',
      fulfilled: 'Your help request has been fulfilled. Thank you for trusting HopeBridge!'
    };
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1,$2,$3,$4)`,
      [hr.beneficiary_id, `Request ${status.replace('_', ' ').toUpperCase()}`, statusMessages[status], 'help_request']
    );
    res.json({ message: 'Request updated!', request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
