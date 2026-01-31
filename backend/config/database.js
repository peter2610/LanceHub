const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

class Database {
  constructor() {
    this.db = null;
    this.pool = null;
    this.type = process.env.DB_TYPE || 'sqlite';
  }

  async connect() {
    try {
      if (this.type === 'sqlite') {
        const dbPath = process.env.SQLITE_PATH || './database/lancehub.db';
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('Error opening SQLite database:', err.message);
          } else {
            console.log('Connected to SQLite database');
            this.enableForeignKeys();
          }
        });
      } else if (this.type === 'postgres') {
        this.pool = new Pool({
          host: process.env.PG_HOST,
          port: process.env.PG_PORT,
          database: process.env.PG_DATABASE,
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
        });
        console.log('Connected to PostgreSQL database');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  enableForeignKeys() {
    if (this.db) {
      this.db.run('PRAGMA foreign_keys = ON');
    }
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (this.type === 'sqlite') {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else if (this.type === 'postgres') {
        this.pool.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        });
      }
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (this.type === 'sqlite') {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      } else if (this.type === 'postgres') {
        this.pool.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({ id: result.rows[0]?.id, changes: result.rowCount });
          }
        });
      }
    });
  }

  async close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing SQLite database:', err.message);
        } else {
          console.log('SQLite database closed');
        }
      });
    }
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL pool closed');
    }
  }
}

module.exports = new Database();
