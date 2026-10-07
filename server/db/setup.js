require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./index');

async function setup() {
  console.log('🔄 Initializing HopeBridge database tables and sample data...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);

    // Hash passwords for seed accounts
    const adminPass = await bcrypt.hash('admin123', 10);
    const donorPass = await bcrypt.hash('donor123', 10);
    const volunteerPass = await bcrypt.hash('volunteer123', 10);
    const beneficiaryPass = await bcrypt.hash('beneficiary123', 10);

    // Seed users
    const seedUsers = [
      { name: 'HopeBridge Admin', email: 'admin@hopebridge.org', password: adminPass, role: 'admin', is_verified: true },
      { name: 'Sarah Jenkins', email: 'donor@hopebridge.org', password: donorPass, role: 'donor', is_verified: true },
      { name: 'Alex Rivera', email: 'volunteer@hopebridge.org', password: volunteerPass, role: 'volunteer', is_verified: true },
      { name: 'Maria Gomez', email: 'beneficiary@hopebridge.org', password: beneficiaryPass, role: 'beneficiary', is_verified: true },
    ];

    for (const u of seedUsers) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, is_verified, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (email) DO UPDATE SET password = $3, is_verified = true`,
        [u.name, u.email, u.password, u.role, u.is_verified]
      );
    }
    console.log('✅ Seed users created/updated.');

    // Get admin ID
    const adminRes = await pool.query(`SELECT id FROM users WHERE email = 'admin@hopebridge.org'`);
    const adminId = adminRes.rows[0].id;

    // Seed Sample Campaigns
    const sampleCampaigns = [
      {
        title: 'Emergency Flood Relief Fund 2026',
        description: 'Providing food, clean water, blankets, and essential medical supplies to 1,500 families impacted by regional monsoons.',
        category: 'Disaster Relief',
        goal_amount: 50000,
        raised_amount: 32450,
        image_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        status: 'active'
      },
      {
        title: 'Warm Winter Blankets & Shelter Support',
        description: 'Distributing warm coats, thermal blankets, and temporary housing kits for homeless individuals and underprivileged families.',
        category: 'Shelter',
        goal_amount: 25000,
        raised_amount: 18200,
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
        start_date: '2026-01-15',
        end_date: '2026-11-30',
        status: 'active'
      },
      {
        title: 'Tech Kits & School Supplies for Kids',
        description: 'Equipping underprivileged students with laptops, backpacks, notebooks, and learning software for school success.',
        category: 'Education',
        goal_amount: 15000,
        raised_amount: 9800,
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        start_date: '2026-02-01',
        end_date: '2026-10-31',
        status: 'active'
      },
      {
        title: 'Community Food Kitchen & Nutrition',
        description: 'Serving hot, nutritious meals daily to elderly residents, children, and struggling local families in urban shelters.',
        category: 'Food',
        goal_amount: 20000,
        raised_amount: 14750,
        image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        start_date: '2026-01-10',
        end_date: '2026-12-15',
        status: 'active'
      }
    ];

    for (const c of sampleCampaigns) {
      await pool.query(
        `INSERT INTO campaigns (title, description, category, goal_amount, raised_amount, image_url, start_date, end_date, status, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [c.title, c.description, c.category, c.goal_amount, c.raised_amount, c.image_url, c.start_date, c.end_date, c.status, adminId]
      );
    }
    console.log('✅ Sample campaigns seeded.');

    // Seed Volunteer Opportunities
    const sampleOpportunities = [
      {
        title: 'Community Weekend Meal Prep & Distribution',
        description: 'Help pack and distribute nutritious meal boxes at the central community hub for local families.',
        category: 'Food Assistance',
        location: 'Downtown Hope Center',
        event_date: '2026-10-25',
        event_time: '09:00:00',
        slots_available: 25,
        slots_filled: 8,
        requirements: 'Comfortable shoes, enthusiastic attitude, age 16+'
      },
      {
        title: 'Youth Math & Reading Tutor',
        description: 'Provide after-school tutoring sessions for elementary and middle school students.',
        category: 'Education',
        location: 'HopeBridge Learning Lab',
        event_date: '2026-10-28',
        event_time: '15:30:00',
        slots_available: 15,
        slots_filled: 6,
        requirements: 'Background in basic math or english, background check'
      },
      {
        title: 'Medical Supply Sorting & Packaging',
        description: 'Assist healthcare workers in sorting and packing sterile medical supplies for field clinics.',
        category: 'Medical',
        location: 'Metro Logistics Warehouse',
        event_date: '2026-11-05',
        event_time: '10:00:00',
        slots_available: 20,
        slots_filled: 12,
        requirements: 'Attention to detail, masks provided'
      }
    ];

    for (const opp of sampleOpportunities) {
      await pool.query(
        `INSERT INTO volunteer_opportunities (title, description, category, location, event_date, event_time, slots_available, slots_filled, requirements, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [opp.title, opp.description, opp.category, opp.location, opp.event_date, opp.event_time, opp.slots_available, opp.slots_filled, opp.requirements, adminId]
      );
    }
    console.log('✅ Sample volunteer opportunities seeded.');

    console.log('\n=======================================');
    console.log('🎉 HopeBridge Database Fully Configured!');
    console.log('=======================================');
    console.log('Demo Credentials:');
    console.log('🛡️ Admin:       admin@hopebridge.org       / admin123');
    console.log('💖 Donor:       donor@hopebridge.org       / donor123');
    console.log('🤝 Volunteer:   volunteer@hopebridge.org   / volunteer123');
    console.log('🏠 Beneficiary: beneficiary@hopebridge.org / beneficiary123\n');
  } catch (err) {
    console.error('❌ Database setup error:', err.message);
  } finally {
    await pool.end();
  }
}

setup();
