const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function migrate() {
  try {
    await db.connect();

    // Create tables
    const migrations = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('CLIENT', 'WRITER', 'ADMIN')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Writers table (extended user info for writers)
      `CREATE TABLE IF NOT EXISTS writers (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0.00,
        bio TEXT,
        specialties TEXT,
        active_assignments INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // Assignments table
      `CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(50) PRIMARY KEY,
        client_id INTEGER NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'PAID')),
        amount DECIMAL(10,2) NOT NULL,
        deadline DATE NOT NULL,
        assigned_writer_id INTEGER,
        writer_name VARCHAR(255),
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        paid BOOLEAN DEFAULT FALSE,
        paid_at DATE,
        requirements TEXT,
        download_url VARCHAR(500),
        upload_url VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_writer_id) REFERENCES users(id) ON DELETE SET NULL
      )`,

      // Assignment status history
      `CREATE TABLE IF NOT EXISTS assignment_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        changed_by INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
        transaction_id VARCHAR(255),
        client_id INTEGER NOT NULL,
        writer_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (writer_id) REFERENCES users(id) ON DELETE SET NULL
      )`,

      // Files table
      `CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id VARCHAR(50) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        uploaded_by INTEGER NOT NULL,
        file_category VARCHAR(50) NOT NULL CHECK (file_category IN ('REQUIREMENT', 'SUBMISSION', 'SAMPLE')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
      )`
    ];

    for (const migration of migrations) {
      await db.run(migration);
    }

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrate();
