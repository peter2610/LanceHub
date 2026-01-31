const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all writers (admin only)
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const writers = await db.query(`
      SELECT w.*, u.name, u.email, u.created_at
      FROM writers w
      JOIN users u ON w.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json(writers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending writers (admin only)
router.get('/pending', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const writers = await db.query(`
      SELECT w.*, u.name, u.email
      FROM writers w
      JOIN users u ON w.user_id = u.id
      WHERE w.status = 'PENDING'
    `);
    res.json(writers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve writer (admin only)
router.put('/:id/approve', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    await db.run('UPDATE writers SET status = ? WHERE user_id = ?', ['APPROVED', req.params.id]);
    res.json({ message: 'Writer approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject writer (admin only)
router.put('/:id/reject', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    await db.run('UPDATE writers SET status = ? WHERE user_id = ?', ['REJECTED', req.params.id]);
    res.json({ message: 'Writer rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
