import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { volunteersAPI } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';

const CATEGORIES = ['All', 'Teaching', 'Healthcare', 'Environment', 'Construction', 'Food Distribution', 'IT Support'];

export default function VolunteerPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = {};
    if (category !== 'All') params.category = category;
    volunteersAPI.getOpportunities(params).then(res => setOpportunities(res.data || [])).catch(() => setOpportunities([])).finally(() => setLoading(false));
  }, [category]);

  const handleApply = async (id) => {
    if (!user) return navigate('/login');
    if (user.role !== 'volunteer') return toast.error('Only volunteers can apply. Register as a volunteer.');
    setApplying(id);
    try {
      await volunteersAPI.apply(id);
      toast.success('Application submitted! We will contact you soon. 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed.');
    } finally { setApplying(null); }
  };

  return (
    <div>
      <Navbar />
      <div className="page-hero">
        <h1>Volunteer <span style={{ background: 'linear-gradient(135deg, #43C6AC, #6C63FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Opportunities</span></h1>
        <p>Lend your skills and time to make a real difference in your community.</p>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="filter-bar">
          {CATEGORIES.map(c => <button key={c} className={`filter-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="empty-state"><div className="icon">🤝</div><h3>No opportunities found</h3><p>Check back soon for new volunteer opportunities.</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {opportunities.map(o => (
              <div key={o.id} className="vol-card">
                <div className="vol-card-header">
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: 8, display: 'inline-flex' }}>{o.category}</span>
                    <h3>{o.title}</h3>
                  </div>
                  <span className={`badge ${o.slots_filled >= o.slots_available ? 'badge-error' : 'badge-success'}`}>
                    {o.slots_filled >= o.slots_available ? 'Full' : 'Open'}
                  </span>
                </div>
                <p>{o.description}</p>
                <div className="vol-meta">
                  {o.location && <div className="vol-meta-item"><FiMapPin size={12} />{o.location}</div>}
                  {o.event_date && <div className="vol-meta-item"><FiCalendar size={12} />{new Date(o.event_date).toLocaleDateString()}</div>}
                  {o.event_time && <div className="vol-meta-item"><FiClock size={12} />{o.event_time}</div>}
                  <div className="vol-meta-item"><FiUsers size={12} />{o.slots_filled}/{o.slots_available} slots filled</div>
                </div>
                {o.requirements && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>📋 {o.requirements}</p>}
                <button onClick={() => handleApply(o.id)} disabled={applying === o.id || o.slots_filled >= o.slots_available}
                  className={`btn ${o.slots_filled >= o.slots_available ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                  {applying === o.id ? 'Applying...' : o.slots_filled >= o.slots_available ? 'No Slots Available' : '🤝 Apply Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
