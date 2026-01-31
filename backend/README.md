# LanceHub Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env` file and update the configuration:
```bash
cp .env.example .env
```

### 3. Database Setup
```bash
# Run migrations
npm run migrate

# Seed database with sample data
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Assignments
- `GET /api/assignments` - Get all assignments (admin)
- `GET /api/assignments/my` - Get my assignments (client/writer)
- `GET /api/assignments/:id` - Get single assignment
- `POST /api/assignments` - Create assignment (client)
- `PUT /api/assignments/:id/assign` - Assign writer (admin)
- `PUT /api/assignments/:id/status` - Update status
- `DELETE /api/assignments/:id` - Delete assignment (admin)
- `POST /api/assignments/bulk-assign` - Bulk assign (admin)
- `POST /api/assignments/bulk-delete` - Bulk delete (admin)

### Writers
- `GET /api/writers` - Get all writers (admin)
- `GET /api/writers/pending` - Get pending writers (admin)
- `PUT /api/writers/:id/approve` - Approve writer (admin)
- `PUT /api/writers/:id/reject` - Reject writer (admin)

## Database Schema

### Users Table
- id, email, password, name, role, created_at, updated_at

### Writers Table
- id, user_id, rating, bio, specialties, active_assignments, status

### Assignments Table
- id, client_id, title, description, status, amount, deadline, assigned_writer_id, writer_name, submitted_at, paid, paid_at, requirements, download_url, upload_url, created_at, updated_at

### Assignment History Table
- id, assignment_id, status, changed_by, notes, created_at

### Payments Table
- id, assignment_id, amount, payment_method, status, transaction_id, client_id, writer_id, created_at, updated_at

### Files Table
- id, assignment_id, filename, original_name, file_path, file_size, file_type, uploaded_by, file_category, created_at

## Sample Users

### Admin
- Email: admin@lancehub.com
- Password: admin123

### Clients
- Email: john@client.com
- Password: client123
- Email: jane@client.com
- Password: client123

### Writers
- Email: alice@writer.com
- Password: writer123
- Email: bob@writer.com
- Password: writer123
- Email: carol@writer.com
- Password: writer123

## Features

- JWT Authentication
- Role-based access control
- SQLite database (easily switchable to PostgreSQL)
- Rate limiting
- CORS support
- File upload support
- Assignment status tracking
- Writer management system
- Payment tracking
- Bulk operations

## Production Deployment

1. Set `NODE_ENV=production`
2. Use PostgreSQL instead of SQLite
3. Update JWT secret
4. Configure proper CORS origin
5. Set up SSL/HTTPS
6. Configure proper file storage
