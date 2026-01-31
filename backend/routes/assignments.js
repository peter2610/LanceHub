const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Get all assignments (admin only)
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = `
      SELECT a.*, u.name as client_name, u.email as client_email,
             w.name as writer_name
      FROM assignments a
      LEFT JOIN users u ON a.client_id = u.id
      LEFT JOIN users w ON a.assigned_writer_id = w.id
    `;
    
    const params = [];
    const conditions = [];
    
    if (status && status !== 'all') {
      conditions.push('a.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(a.title LIKE ? OR a.id LIKE ? OR u.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.created_at DESC';
    
    const assignments = await db.query(query, params);
    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments for current user (client or writer)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query;
    let params = [];
    
    if (req.user.role === 'CLIENT') {
      query = `
        SELECT a.*, 
               CASE WHEN a.paid THEN 'PAID' ELSE a.status END as display_status
        FROM assignments a
        WHERE a.client_id = ?
      `;
      params.push(req.user.id);
    } else if (req.user.role === 'WRITER') {
      query = `
        SELECT a.*, u.name as client_name, u.email as client_email
        FROM assignments a
        LEFT JOIN users u ON a.client_id = u.id
        WHERE a.assigned_writer_id = ? AND a.status != 'PENDING'
      `;
      params.push(req.user.id);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const conditions = [];
    
    if (status && status !== 'all') {
      conditions.push('a.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(a.title LIKE ? OR a.id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.created_at DESC';
    
    const assignments = await db.query(query, params);
    res.json(assignments);
  } catch (error) {
    console.error('Get my assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single assignment
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT a.*, u.name as client_name, u.email as client_email,
             w.name as writer_name, w.email as writer_email
      FROM assignments a
      LEFT JOIN users u ON a.client_id = u.id
      LEFT JOIN users w ON a.assigned_writer_id = w.id
      WHERE a.id = ?
    `;
    
    const assignments = await db.query(query, [id]);
    
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    const assignment = assignments[0];
    
    // Check permissions
    if (req.user.role === 'CLIENT' && assignment.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'WRITER' && assignment.assigned_writer_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment (client only)
router.post('/', authMiddleware, roleMiddleware(['CLIENT']), validate(schemas.createAssignment), async (req, res) => {
  try {
    const { title, description, amount, deadline, requirements } = req.body;
    
    // Generate assignment ID
    const assignmentId = `LH-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    await db.run(
      `INSERT INTO assignments (id, client_id, title, description, amount, deadline, requirements) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [assignmentId, req.user.id, title, description, amount, deadline, requirements]
    );
    
    // Add to history
    await db.run(
      'INSERT INTO assignment_history (assignment_id, status, changed_by, notes) VALUES (?, ?, ?, ?)',
      [assignmentId, 'PENDING', req.user.id, 'Assignment created']
    );
    
    res.status(201).json({
      message: 'Assignment created successfully',
      assignmentId
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign writer to assignment (admin only)
router.put('/:id/assign', authMiddleware, roleMiddleware(['ADMIN']), validate(schemas.assignWriter), async (req, res) => {
  try {
    const { id } = req.params;
    const { writerId, writerName } = req.body;
    
    // Update assignment
    await db.run(
      `UPDATE assignments 
       SET assigned_writer_id = ?, writer_name = ?, status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [writerId, writerName, id]
    );
    
    // Add to history
    await db.run(
      'INSERT INTO assignment_history (assignment_id, status, changed_by, notes) VALUES (?, ?, ?, ?)',
      [id, 'ASSIGNED', req.user.id, `Assigned to ${writerName}`]
    );
    
    res.json({ message: 'Writer assigned successfully' });
  } catch (error) {
    console.error('Assign writer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Get assignment first
    const assignments = await db.query('SELECT * FROM assignments WHERE id = ?', [id]);
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    const assignment = assignments[0];
    
    // Check permissions
    if (req.user.role === 'WRITER' && assignment.assigned_writer_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Validate status transitions
    const validTransitions = {
      'ASSIGNED': ['IN_PROGRESS'],
      'IN_PROGRESS': ['COMPLETED'],
      'COMPLETED': ['PAID']
    };
    
    if (req.user.role === 'WRITER' && validTransitions[assignment.status] && !validTransitions[assignment.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }
    
    // Update assignment
    await db.run(
      'UPDATE assignments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    
    // Add to history
    await db.run(
      'INSERT INTO assignment_history (assignment_id, status, changed_by, notes) VALUES (?, ?, ?, ?)',
      [id, status, req.user.id, notes || `Status changed to ${status}`]
    );
    
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete assignment (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.run('DELETE FROM assignments WHERE id = ?', [id]);
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk assign writers (admin only)
router.post('/bulk-assign', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { assignmentIds, writerId, writerName } = req.body;
    
    for (const assignmentId of assignmentIds) {
      await db.run(
        `UPDATE assignments 
         SET assigned_writer_id = ?, writer_name = ?, status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [writerId, writerName, assignmentId]
      );
      
      await db.run(
        'INSERT INTO assignment_history (assignment_id, status, changed_by, notes) VALUES (?, ?, ?, ?)',
        [assignmentId, 'ASSIGNED', req.user.id, `Bulk assigned to ${writerName}`]
      );
    }
    
    res.json({ message: 'Assignments assigned successfully' });
  } catch (error) {
    console.error('Bulk assign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk delete assignments (admin only)
router.post('/bulk-delete', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { assignmentIds } = req.body;
    
    const placeholders = assignmentIds.map(() => '?').join(',');
    await db.run(`DELETE FROM assignments WHERE id IN (${placeholders})`, assignmentIds);
    
    res.json({ message: 'Assignments deleted successfully' });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
