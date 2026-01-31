const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await db.connect();

    // Seed users
    const users = [
      {
        email: 'admin@lancehub.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'ADMIN'
      },
      {
        email: 'john@client.com',
        password: await bcrypt.hash('client123', 10),
        name: 'John Doe',
        role: 'CLIENT'
      },
      {
        email: 'jane@client.com',
        password: await bcrypt.hash('client123', 10),
        name: 'Jane Smith',
        role: 'CLIENT'
      },
      {
        email: 'alice@writer.com',
        password: await bcrypt.hash('writer123', 10),
        name: 'Alice Johnson',
        role: 'WRITER'
      },
      {
        email: 'bob@writer.com',
        password: await bcrypt.hash('writer123', 10),
        name: 'Bob Smith',
        role: 'WRITER'
      },
      {
        email: 'carol@writer.com',
        password: await bcrypt.hash('writer123', 10),
        name: 'Carol Davis',
        role: 'WRITER'
      }
    ];

    for (const user of users) {
      try {
        await db.run(
          'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
          [user.email, user.password, user.name, user.role]
        );
      } catch (error) {
        // Ignore duplicate errors
        if (!error.message.includes('UNIQUE')) {
          throw error;
        }
      }
    }

    // Get user IDs
    const adminUser = await db.query('SELECT id FROM users WHERE email = ?', ['admin@lancehub.com']);
    const clientUsers = await db.query('SELECT id, name FROM users WHERE role = ?', ['CLIENT']);
    const writerUsers = await db.query('SELECT id, name FROM users WHERE role = ?', ['WRITER']);

    // Seed writers with additional info
    const writers = [
      { user_id: writerUsers[0].id, rating: 4.8, bio: 'Experienced academic writer', specialties: 'Research Papers, Essays', status: 'APPROVED' },
      { user_id: writerUsers[1].id, rating: 4.6, bio: 'Business writing expert', specialties: 'Business Plans, Marketing', status: 'APPROVED' },
      { user_id: writerUsers[2].id, rating: 4.9, bio: 'Technical documentation specialist', specialties: 'Technical Writing, Documentation', status: 'APPROVED' }
    ];

    for (const writer of writers) {
      try {
        await db.run(
          'INSERT INTO writers (user_id, rating, bio, specialties, status) VALUES (?, ?, ?, ?, ?)',
          [writer.user_id, writer.rating, writer.bio, writer.specialties, writer.status]
        );
      } catch (error) {
        if (!error.message.includes('UNIQUE')) {
          throw error;
        }
      }
    }

    // Seed assignments
    const assignments = [
      {
        id: 'LH-2025-001',
        client_id: clientUsers[0].id,
        title: 'Research Paper on Machine Learning',
        description: '10-page research paper on ML applications in healthcare',
        status: 'PENDING',
        amount: 150.00,
        deadline: '2025-02-01'
      },
      {
        id: 'LH-2025-002',
        client_id: clientUsers[1].id,
        title: 'Business Plan for Startup',
        description: 'Comprehensive business plan for tech startup including financial projections',
        status: 'ASSIGNED',
        amount: 200.00,
        deadline: '2025-02-15',
        assigned_writer_id: writerUsers[0].id,
        writer_name: writerUsers[0].name
      },
      {
        id: 'LH-2025-003',
        client_id: clientUsers[0].id,
        title: 'Marketing Strategy Analysis',
        description: 'In-depth analysis of current marketing strategies and recommendations',
        status: 'IN_PROGRESS',
        amount: 150.00,
        deadline: '2025-02-10',
        assigned_writer_id: writerUsers[1].id,
        writer_name: writerUsers[1].name
      },
      {
        id: 'LH-2025-004',
        client_id: clientUsers[1].id,
        title: 'Technical Documentation',
        description: 'User manual and API documentation for software product',
        status: 'COMPLETED',
        amount: 180.00,
        deadline: '2025-02-05',
        assigned_writer_id: writerUsers[2].id,
        writer_name: writerUsers[2].name
      },
      {
        id: 'LH-2025-005',
        client_id: clientUsers[0].id,
        title: 'Content Writing for Blog',
        description: '5 blog posts on digital marketing trends',
        status: 'PENDING',
        amount: 100.00,
        deadline: '2025-02-03'
      }
    ];

    for (const assignment of assignments) {
      try {
        await db.run(
          `INSERT INTO assignments (id, client_id, title, description, status, amount, deadline, assigned_writer_id, writer_name) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            assignment.id, assignment.client_id, assignment.title, assignment.description,
            assignment.status, assignment.amount, assignment.deadline,
            assignment.assigned_writer_id || null, assignment.writer_name || null
          ]
        );
      } catch (error) {
        if (!error.message.includes('UNIQUE')) {
          throw error;
        }
      }
    }

    // Seed assignment history
    const history = [
      { assignment_id: 'LH-2025-002', status: 'ASSIGNED', changed_by: adminUser[0].id, notes: 'Assigned to Alice Johnson' },
      { assignment_id: 'LH-2025-003', status: 'IN_PROGRESS', changed_by: writerUsers[1].id, notes: 'Started working on assignment' },
      { assignment_id: 'LH-2025-004', status: 'COMPLETED', changed_by: writerUsers[2].id, notes: 'Assignment completed and submitted' }
    ];

    for (const entry of history) {
      await db.run(
        'INSERT INTO assignment_history (assignment_id, status, changed_by, notes) VALUES (?, ?, ?, ?)',
        [entry.assignment_id, entry.status, entry.changed_by, entry.notes]
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

seed();
