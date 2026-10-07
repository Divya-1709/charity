import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { campaignsAPI } from '../api';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = ['All', 'Education', 'Medical', 'Food', 'Shelter', 'Environment', 'Emergency', 'Community'];
const EMOJI_MAP = { education: '📚', medical: '🏥', food: '🍎', shelter: '🏠', environment: '🌱', emergency: '🆘', community: '🤝' };

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = { limit: 50 };
    if (category !== 'All') params.category = category.toLowerCase();
    campaignsAPI.getAll(params).then(res => setCampaigns(res.data.campaigns || [])).catch(() => setCampaigns([])).finally(() => setLoading(false));
  }, [category]);

  const filtered = campaigns.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Navbar />
      <div className="page-hero">
        <h1>Active <span style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Campaigns</span></h1>
        <p>Browse verified campaigns and make a meaningful contribution today.</p>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <div className="search-bar">
            <FiSearch className="search-icon" size={18} />
            <input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 44 }} />
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading campaigns...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No campaigns found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {filtered.map(c => {
              const progress = Math.min(100, c.progress_percent || 0);
              const emoji = EMOJI_MAP[c.category?.toLowerCase()] || '💙';
              return (
                <div key={c.id} className="campaign-card" onClick={() => navigate(`/campaigns/${c.id}`)}>
                  <div className="campaign-card-img">
                    {c.image_url ? <img src={c.image_url} alt={c.title} /> : <span style={{ fontSize: 56 }}>{emoji}</span>}
                  </div>
                  <div className="campaign-card-body">
                    <div className="campaign-category">{c.category}</div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                    <div className="campaign-stats">
                      <div>
                        <div className="campaign-raised">${Number(c.raised_amount || 0).toLocaleString()}</div>
                        <div className="campaign-goal">of ${Number(c.goal_amount || 0).toLocaleString()}</div>
                      </div>
                      <span className="badge badge-primary">{progress}% funded</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
