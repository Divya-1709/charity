import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { campaignsAPI } from '../api';
import {
  FiArrowRight,
  FiHeart,
  FiUsers,
  FiFlag,
  FiTrendingUp,
  FiShield,
  FiStar,
  FiCheckCircle,
  FiAward,
  FiActivity,
  FiHelpCircle
} from 'react-icons/fi';

const CAUSE_CATEGORIES = [
  {
    title: 'Food Security & Nutrition',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    count: '3,200+ Meals Served',
    category: 'food'
  },
  {
    title: 'Healthcare & Medical Relief',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    count: '1,450+ Patients Treated',
    category: 'medical'
  },
  {
    title: 'Quality Education & Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    count: '820+ Students Funded',
    category: 'education'
  },
  {
    title: 'Emergency Shelter & Warmth',
    image: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=600&q=80',
    count: '540+ Families Housed',
    category: 'shelter'
  },
  {
    title: 'Disaster & Flood Relief',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    count: '12 Regional Rescue Missions',
    category: 'disaster'
  },
  {
    title: 'Community Empowerment',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80',
    count: '95 Community Hubs',
    category: 'community'
  }
];

const IMPACT_TIERS = {
  25: { meals: '15 Hot Meals', desc: 'Provides nutritious hot meals and clean drinking water for a family in crisis.' },
  50: { meals: 'Full School Kit', desc: 'Supplies backpacks, books, stationery, and learning tools for 2 young students.' },
  100: { meals: 'Emergency First-Aid', desc: 'Covers essential prescription medicine, first aid, and doctor checkup for an elderly patient.' },
  250: { meals: 'Temporary Housing Kit', desc: 'Funds emergency shelter bedding, thermal coats, and hygiene kits for displaced families.' }
};

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Verified Donor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    text: 'What sets HopeBridge apart is the total transparency. I received photo updates showing the exact school supplies delivered to the children my donation funded!',
    rating: 5
  },
  {
    name: 'Alex Rivera',
    role: 'Volunteer Coordinator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'Finding nearby volunteer events with verified organizers was always difficult before. HopeBridge makes registering and earning certified hours effortless.',
    rating: 5
  },
  {
    name: 'Maria Gomez',
    role: 'Community Beneficiary',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    text: 'When the winter floods destroyed our roof, our help request was reviewed in under 24 hours. The emergency shelter support kept my children safe and warm.',
    rating: 5
  }
];

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTier, setSelectedTier] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    campaignsAPI.getAll({ limit: 6 })
      .then(res => setCampaigns(res.data.campaigns || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-split">
            {/* Left Content */}
            <div className="hero-content" style={{ maxWidth: '100%' }}>
              <div className="hero-badge">
                <FiStar size={14} style={{ color: '#F7971E' }} />
                <span>Empowering 10,000+ Lives Worldwide</span>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 64px)' }}>
                Bridge the Gap Between <span className="gradient-text">Compassion & Action</span>
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 32 }}>
                HopeBridge unites generous donors, passionate volunteers, and families in need under one 100% verified, transparent platform. Experience real-time tracking from pledge to delivery.
              </p>

              <div className="hero-actions" style={{ marginBottom: 40 }}>
                <Link to="/campaigns" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                  Explore Campaigns <FiArrowRight />
                </Link>
                <Link to="/register?role=volunteer" className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>
                  <FiHeart style={{ color: 'var(--secondary)' }} /> Become a Volunteer
                </Link>
                <Link to="/register?role=beneficiary" className="btn btn-secondary" style={{ fontSize: 15, padding: '14px 22px' }}>
                  <FiHelpCircle /> Request Aid
                </Link>
              </div>

              {/* Social Proof + Avatars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ display: 'flex', marginLeft: 8 }}>
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Donor"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF',
                        marginLeft: -10,
                        objectFit: 'cover',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>500+ supporters</strong> joined this week • <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Live Now</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="hero-stats" style={{ marginTop: 0 }}>
                <div className="hero-stat">
                  <h3>$2.4M+</h3>
                  <p>Funds Distributed</p>
                </div>
                <div className="hero-stat">
                  <h3>12,850+</h3>
                  <p>Lives Impacted</p>
                </div>
                <div className="hero-stat">
                  <h3>1,420+</h3>
                  <p>Certified Volunteers</p>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase Card */}
            <div className="hero-visual-card">
              <div className="hero-main-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                  alt="HopeBridge Children & Community Support"
                />
                <div className="hero-overlay-gradient" />
                <div style={{
                  position: 'absolute',
                  bottom: 24,
                  left: 24,
                  right: 24,
                  color: 'white',
                  zIndex: 2
                }}>
                  <span className="badge badge-primary" style={{ marginBottom: 8, background: '#FFFFFF', color: 'var(--primary)' }}>Emergency Relief</span>
                  <h3 style={{ fontSize: 20, marginBottom: 4, color: '#FFFFFF' }}>HopeBridge Field Mission 2026</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>Direct delivery of winter supplies to high-altitude mountain villages.</p>
                </div>
              </div>

              {/* Floating Live Ticker Badges */}
              <div className="floating-badge-top">
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#EEF2FF',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18
                }}>
                  <FiHeart />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recent Donation</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>$150 • Flood Relief</div>
                </div>
              </div>

              <div className="floating-badge-bottom">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#F0FDF4',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}>
                    <FiShield />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verification Guarantee</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>100% Admin Audited</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAUSE CATEGORIES SECTION ===== */}
      <section className="section" style={{ background: 'var(--bg2)', paddingTop: 60 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><FiFlag size={12} /> Causes We Support</div>
            <h2>Explore Our <span className="gradient-text">Impact Sectors</span></h2>
            <p>Every contribution directly supports dedicated programs designed to transform vulnerable communities.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24
          }}>
            {CAUSE_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                onClick={() => navigate('/campaigns')}
              >
                <img src={cat.image} alt={cat.title} />
                <div className="category-card-overlay">
                  <span className="badge badge-primary" style={{ width: 'fit-content', marginBottom: 6 }}>
                    {cat.count}
                  </span>
                  <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}>{cat.title}</h3>
                  <div style={{ fontSize: 12, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Support this cause <FiArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVE CAMPAIGNS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><FiActivity size={12} /> Urgent Needs</div>
            <h2>Active <span className="gradient-text">Verified Campaigns</span></h2>
            <p>Directly fund urgent campaigns. 100% of public donations go directly to program initiatives.</p>
          </div>

          {campaigns.length > 0 ? (
            <>
              <div className="campaigns-grid">
                {campaigns.map(c => {
                  const progress = Math.min(100, Math.round(((c.raised_amount || 0) / (c.goal_amount || 1)) * 100));
                  return (
                    <div
                      key={c.id}
                      className="campaign-card"
                      onClick={() => navigate(`/campaigns/${c.id}`)}
                    >
                      <div className="campaign-card-img">
                        <img
                          src={c.image_url || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'}
                          alt={c.title}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          zIndex: 2
                        }}>
                          <span className="badge badge-primary">{c.category}</span>
                        </div>
                      </div>

                      <div className="campaign-card-body">
                        <h3 style={{ fontSize: 18, marginBottom: 8, height: 48, overflow: 'hidden' }}>{c.title}</h3>
                        <p style={{
                          fontSize: 13,
                          color: 'var(--text-muted)',
                          marginBottom: 16,
                          height: 40,
                          overflow: 'hidden'
                        }}>
                          {c.description}
                        </p>

                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="campaign-stats" style={{ marginTop: 12 }}>
                          <div>
                            <div className="campaign-raised">${Number(c.raised_amount || 0).toLocaleString()}</div>
                            <div className="campaign-goal">Goal: ${Number(c.goal_amount || 0).toLocaleString()}</div>
                          </div>
                          <span className="badge badge-success">{progress}% Funded</span>
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '10px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/campaigns/${c.id}`);
                          }}
                        >
                          <FiHeart /> Donate Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link to="/campaigns" className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 36px' }}>
                  Browse All Campaigns <FiArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
              <h3>Loading campaigns...</h3>
            </div>
          )}
        </div>
      </section>

      {/* ===== INTERACTIVE DONATION IMPACT CALCULATOR ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #FFF1F2 100%)',
            border: '1.5px solid #C7D2FE',
            borderRadius: 24,
            padding: '48px 36px',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
              <div className="section-tag"><FiAward size={12} /> Real-World Tangible Impact</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', marginBottom: 12 }}>See Exactly What Your Donation Achieves</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Select a donation tier below to visualize the direct impact on community members.</p>
            </div>

            {/* Tier Selectors */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 32
            }}>
              {[25, 50, 100, 250].map(amount => (
                <button
                  key={amount}
                  className={`calc-pill ${selectedTier === amount ? 'active' : ''}`}
                  onClick={() => setSelectedTier(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div style={{
              maxWidth: 580,
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              border: '1.5px solid var(--card-border)',
              textAlign: 'center',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>
                ${selectedTier} = {IMPACT_TIERS[selectedTier]?.meals}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                {IMPACT_TIERS[selectedTier]?.desc}
              </p>
              <button
                className="btn btn-primary"
                style={{ padding: '12px 32px' }}
                onClick={() => navigate('/campaigns')}
              >
                Pledge ${selectedTier} Today <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE 4 PILLARS / ROLE SHOWCASE ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><FiUsers size={12} /> The HopeBridge Community</div>
            <h2>Built for Everyone to <span className="gradient-text">Make a Difference</span></h2>
            <p>Our platform brings all four key stakeholders together under one seamless roof.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24
          }}>
            {/* Donor */}
            <div className="role-card">
              <div className="role-card-img">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=600&q=80"
                  alt="Donors"
                />
              </div>
              <div className="role-card-body">
                <div style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>For Donors</div>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>Transparent Giving</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, flex: 1 }}>
                  Browse curated campaigns, donate securely, track fund utilization in real-time, and download tax receipts.
                </p>
                <Link to="/register?role=donor" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Register as Donor
                </Link>
              </div>
            </div>

            {/* Volunteer */}
            <div className="role-card">
              <div className="role-card-img">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80"
                  alt="Volunteers"
                />
              </div>
              <div className="role-card-body">
                <div style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>For Volunteers</div>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>Service & Growth</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, flex: 1 }}>
                  Join local and field missions, log volunteer hours, collaborate with peers, and earn certified badges.
                </p>
                <Link to="/register?role=volunteer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Join Volunteer Team
                </Link>
              </div>
            </div>

            {/* Beneficiary */}
            <div className="role-card">
              <div className="role-card-img">
                <img
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80"
                  alt="Beneficiaries"
                />
              </div>
              <div className="role-card-body">
                <div style={{ fontSize: 12, color: '#FCD34D', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>For Beneficiaries</div>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>Dignified Aid</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, flex: 1 }}>
                  Submit requests for food, shelter, or healthcare. Upload documentation securely and track verification status.
                </p>
                <Link to="/register?role=beneficiary" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Apply for Aid
                </Link>
              </div>
            </div>

            {/* Admin */}
            <div className="role-card">
              <div className="role-card-img">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
                  alt="Admins"
                />
              </div>
              <div className="role-card-body">
                <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>For Administrators</div>
                <h3 style={{ fontSize: 19, marginBottom: 8 }}>Audited Governance</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, flex: 1 }}>
                  Manage and verify beneficiaries, approve campaigns, review volunteer applications, and oversee donations.
                </p>
                <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><FiStar size={12} /> Testimonials</div>
            <h2>Voices from Our <span className="gradient-text">Community</span></h2>
            <p>Real experiences from people who give, serve, and receive through HopeBridge.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div>
                  <div style={{ color: '#F7971E', marginBottom: 14, fontSize: 16 }}>
                    {'★'.repeat(t.rating)}
                  </div>
                  <p style={{ color: 'var(--text)', fontStyle: 'italic', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                    "{t.text}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--card-border)', paddingTop: 16 }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</h4>
                    <span style={{ fontSize: 12, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FiCheckCircle size={12} /> {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST & SECURITY BADGES ===== */}
      <section style={{ padding: '40px 0', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', background: 'var(--bg3)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiShield size={28} style={{ color: 'var(--primary-light)' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>256-Bit SSL Encrypted</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bank-grade security</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiCheckCircle size={28} style={{ color: '#4ADE80' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>100% Verified Beneficiaries</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Admin document audit</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiAward size={28} style={{ color: '#F7971E' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Tax-Deductible Receipts</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Instant PDF generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="section">
        <div className="container">
          <div style={{
            textAlign: 'center',
            padding: '70px 40px',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #FFF1F2 100%)',
            borderRadius: 28,
            border: '1.5px solid #C7D2FE',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.06), transparent)',
              pointerEvents: 'none'
            }} />
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', marginBottom: 16, position: 'relative' }}>
              Ready to Build <span className="gradient-text">Bridges of Hope</span>?
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 18,
              maxWidth: 620,
              margin: '0 auto 36px',
              position: 'relative'
            }}>
              Whether you choose to give, volunteer, or refer a family in need — you have the power to change a life today.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '15px 38px' }}>
                Join HopeBridge Free <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: 16, padding: '15px 38px' }}>
                Try Quick Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--card-border)', padding: '50px 0 28px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 36,
            marginBottom: 40
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Logo size={34} />
                <span style={{ fontSize: 20, fontWeight: 800 }}>HopeBridge</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                Connecting donors, volunteers, beneficiaries, and administrators to build stronger, more compassionate communities.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 15, marginBottom: 16 }}>Quick Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-muted)' }}>
                <li><Link to="/campaigns" style={{ transition: 'color 0.2s' }}>All Campaigns</Link></li>
                <li><Link to="/volunteers" style={{ transition: 'color 0.2s' }}>Volunteer Hub</Link></li>
                <li><Link to="/login" style={{ transition: 'color 0.2s' }}>Sign In</Link></li>
                <li><Link to="/register" style={{ transition: 'color 0.2s' }}>Create Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 15, marginBottom: 16 }}>Support Causes</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-muted)' }}>
                <li><Link to="/campaigns" style={{ transition: 'color 0.2s' }}>Emergency Relief</Link></li>
                <li><Link to="/campaigns" style={{ transition: 'color 0.2s' }}>Children's Education</Link></li>
                <li><Link to="/campaigns" style={{ transition: 'color 0.2s' }}>Food & Nutrition</Link></li>
                <li><Link to="/campaigns" style={{ transition: 'color 0.2s' }}>Healthcare Camps</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 15, marginBottom: 16 }}>Contact & Trust</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.8 }}>
                📍 Central Support: 100 Charity Blvd, NY<br />
                📧 <a href="mailto:divyadivya5727@gmail.com" style={{ color: 'var(--text)', fontWeight: 500 }}>divyadivya5727@gmail.com</a><br />
                📞 <a href="tel:9342445341" style={{ color: 'var(--text)', fontWeight: 500 }}>+91 9342445341</a>
              </p>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                ✓ 501(c)(3) Nonprofit Platform
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--card-border)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
            color: 'var(--text-muted)'
          }}>
            <div>© 2026 HopeBridge Platform. All rights reserved.</div>
            <div>Built with ❤️ for communities worldwide.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
