-- HopeBridge Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('donor', 'volunteer', 'beneficiary', 'admin')),
  phone VARCHAR(20),
  address TEXT,
  profile_image VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  raised_amount DECIMAL(12,2) DEFAULT 0,
  image_url VARCHAR(500),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES users(id),
  campaign_id UUID REFERENCES campaigns(id),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  receipt_url VARCHAR(500),
  donated_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Opportunities Table
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  event_date DATE,
  event_time TIME,
  slots_available INTEGER DEFAULT 0,
  slots_filled INTEGER DEFAULT 0,
  requirements TEXT,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Applications Table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES users(id),
  opportunity_id UUID REFERENCES volunteer_opportunities(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  applied_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  certificate_url VARCHAR(500),
  notes TEXT,
  UNIQUE(volunteer_id, opportunity_id)
);

-- Help Requests Table
CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('food', 'education', 'medical', 'shelter', 'clothing', 'other')),
  urgency VARCHAR(50) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  amount_needed DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'fulfilled')),
  document_url VARCHAR(500),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaign Updates Table
CREATE TABLE IF NOT EXISTS campaign_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_apps_volunteer ON volunteer_applications(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_beneficiary ON help_requests(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Seed Admin User (password: admin123)
INSERT INTO users (name, email, password, role, is_verified, is_active)
VALUES ('Admin', 'admin@hopebridge.org', '$2a$10$rBGsITbDVarCCMYVb5cFfO9lzSo9wYqXeHfuCJKo4q0G5kW9a9Hbe', 'admin', true, true)
ON CONFLICT (email) DO NOTHING;
