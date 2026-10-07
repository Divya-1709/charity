# 🌉 HopeBridge — Charity & Community Support Platform

A full-stack React + Node.js/Express + PostgreSQL platform connecting donors, volunteers, beneficiaries, and administrators.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Setup Database
```sql
-- In pgAdmin or psql:
CREATE DATABASE hopebridge;
\c hopebridge
\i server/db/schema.sql
```

### 2. Configure Environment
Edit `server/.env` with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hopebridge
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=hopebridge_super_secret_jwt_key_2024
```

### 3. Start Backend
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 4. Start Frontend
```bash
cd client
npm start
# App runs on http://localhost:3000
```

## 👤 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hopebridge.org | admin123 |

Register new accounts for Donor, Volunteer, and Beneficiary roles.

## 🗺️ Platform Routes

### Public
- `/` — Home page with hero, features, campaigns
- `/campaigns` — Browse all campaigns
- `/campaigns/:id` — Campaign detail + donate
- `/volunteer` — Browse volunteer opportunities
- `/login` — Sign in
- `/register` — Create account (choose role)

### Donor Dashboard (`/donor`)
- Overview stats, donation history
- `/donor/donations` — Full history + download receipts

### Volunteer Dashboard (`/volunteer/dashboard`)
- Application tracker, certificates

### Beneficiary Dashboard (`/beneficiary`)
- Submit help requests (food, medical, shelter, education, clothing)
- Track request status

### Admin Dashboard (`/admin`)
- `/admin` — Stats + charts
- `/admin/campaigns` — Create/manage campaigns
- `/admin/users` — Verify/deactivate users
- `/admin/help-requests` — Review/approve beneficiary requests
- `/admin/volunteers` — Manage opportunities & applications
- `/admin/reports` — Analytics + top donors

## 🏗️ Tech Stack
- **Frontend:** React 18, React Router v6, Recharts, React Icons, React Hot Toast, Axios
- **Backend:** Node.js, Express.js, JWT Auth, bcryptjs, Multer
- **Database:** PostgreSQL with UUID primary keys
- **Design:** Dark mode, glassmorphism, CSS animations
>>>>>>> 811f5c5 (HopeBridge full-stack charity platform with React, Express, and PostgreSQL)
