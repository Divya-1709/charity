const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, adminOnly, roles } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/donations - Make a donation
router.post('/', auth, roles('donor', 'admin'), async (req, res) => {
  try {
    const { campaign_id, amount, payment_method, message, is_anonymous } = req.body;
    if (!campaign_id || !amount) return res.status(400).json({ message: 'Campaign ID and amount required.' });
    const campaign = await pool.query('SELECT * FROM campaigns WHERE id=$1 AND status=$2', [campaign_id, 'active']);
    if (!campaign.rows[0]) return res.status(404).json({ message: 'Campaign not found or inactive.' });
    const transactionId = `TXN-${uuidv4().split('-')[0].toUpperCase()}`;
    const result = await pool.query(
      `INSERT INTO donations (donor_id, campaign_id, amount, payment_method, transaction_id, message, is_anonymous)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, campaign_id, amount, payment_method || 'card', transactionId, message, is_anonymous || false]
    );
    // Update campaign raised amount
    await pool.query('UPDATE campaigns SET raised_amount = raised_amount + $1, updated_at=NOW() WHERE id=$2', [amount, campaign_id]);
    // Notify donor
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)`,
      [req.user.id, 'Donation Successful!', `Your donation of $${amount} to campaign was successful. Transaction: ${transactionId}`, 'donation']
    );
    res.status(201).json({ message: 'Donation successful!', donation: result.rows[0], transactionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/donations/my - Donor's donation history
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.title as campaign_title, c.image_url as campaign_image
       FROM donations d LEFT JOIN campaigns c ON d.campaign_id = c.id
       WHERE d.donor_id = $1 ORDER BY d.donated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/donations/:id/receipt - Download receipt
router.get('/:id/receipt', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.title as campaign_title, u.name as donor_name, u.email as donor_email
       FROM donations d LEFT JOIN campaigns c ON d.campaign_id=c.id LEFT JOIN users u ON d.donor_id=u.id
       WHERE d.id=$1 AND d.donor_id=$2`,
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Donation not found.' });
    const d = result.rows[0];
    res.json({
      receipt: {
        receiptNumber: `RCP-${d.transaction_id}`,
        donorName: d.is_anonymous ? 'Anonymous' : d.donor_name,
        donorEmail: d.donor_email,
        campaign: d.campaign_title,
        amount: d.amount,
        currency: d.currency,
        paymentMethod: d.payment_method,
        transactionId: d.transaction_id,
        date: d.donated_at,
        status: d.status,
        message: 'Thank you for your generous contribution to HopeBridge!'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/donations/admin/all - Admin view all donations
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT d.*, u.name as donor_name, u.email as donor_email, c.title as campaign_title
       FROM donations d LEFT JOIN users u ON d.donor_id=u.id LEFT JOIN campaigns c ON d.campaign_id=c.id
       ORDER BY d.donated_at DESC LIMIT $1 OFFSET $2`, [limit, offset]
    );
    const total = await pool.query('SELECT COUNT(*), SUM(amount) as total_amount FROM donations WHERE status=$1', ['completed']);
    res.json({ donations: result.rows, stats: total.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
