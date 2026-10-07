import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { campaignsAPI, donationsAPI } from '../api';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCalendar, FiHeart, FiX } from 'react-icons/fi';

export default function CampaignDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonate, setShowDonate] = useState(false);
  const [donating, setDonating] = useState(false);
  const [donateForm, setDonateForm] = useState({ amount: '', message: '', is_anonymous: false, payment_method: 'card' });

  useEffect(() => {
    campaignsAPI.getById(id).then(res => setData(res.data)).catch(() => navigate('/campaigns')).finally(() => setLoading(false));
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!donateForm.amount || donateForm.amount <= 0) return toast.error('Enter a valid amount.');
    setDonating(true);
    try {
      await donationsAPI.donate({ campaign_id: id, ...donateForm });
      toast.success('Donation successful! Thank you for your generosity! 💙');
      setShowDonate(false);
      campaignsAPI.getById(id).then(res => setData(res.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed.');
    } finally { setDonating(false); }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div style={{ color: 'var(--primary)', fontSize: 20 }}>Loading...</div></div>;

  const { campaign, updates, recentDonors } = data;
  const progress = Math.min(100, campaign.progress_percent || 0);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <button onClick={() => navigate('/campaigns')} className="btn btn-secondary" style={{ marginBottom: 24 }}>
            <FiArrowLeft /> Back to Campaigns
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            {/* Main */}
            <div>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 20, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: 28 }}>
                {campaign.image_url ? <img src={campaign.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} /> : '💙'}
              </div>
              <span className="badge badge-primary" style={{ marginBottom: 12 }}>{campaign.category}</span>
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 16 }}>{campaign.title}</h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 32 }}>{campaign.description}</p>

              {updates.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 20 }}>Campaign Updates</h3>
                  {updates.map(u => (
                    <div key={u.id} style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <FiCalendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 style={{ marginBottom: 8 }}>{u.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{u.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 28, position: 'sticky', top: 100 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>${Number(campaign.raised_amount || 0).toLocaleString()}</span>
                    <span className="badge badge-success">{progress}%</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>raised of ${Number(campaign.goal_amount).toLocaleString()} goal</p>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24, padding: '16px 0', borderTop: '1px solid var(--card-border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{recentDonors.length}+</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Donors</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{new Date(campaign.end_date).toLocaleDateString()}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>End Date</div>
                  </div>
                </div>
                {user?.role === 'donor' || !user ? (
                  <button onClick={() => user ? setShowDonate(true) : navigate('/login')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}>
                    <FiHeart /> Donate Now
                  </button>
                ) : null}

                {recentDonors.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h4 style={{ marginBottom: 12, fontSize: 14 }}>Recent Donors</h4>
                    {recentDonors.slice(0, 5).map((d, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{d.is_anonymous ? '?' : d.name?.[0]}</div>
                          <span style={{ fontSize: 13 }}>{d.is_anonymous ? 'Anonymous' : d.name}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>${d.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonate && (
        <div className="modal-overlay" onClick={() => setShowDonate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💙 Make a Donation</h3>
              <button className="modal-close" onClick={() => setShowDonate(false)}><FiX /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Supporting: <strong style={{ color: 'var(--text)' }}>{campaign.title}</strong></p>
            <form onSubmit={handleDonate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                {[10, 25, 50, 100].map(a => (
                  <button key={a} type="button" onClick={() => setDonateForm({ ...donateForm, amount: a })}
                    style={{ padding: '10px', background: donateForm.amount == a ? 'var(--primary)' : 'var(--bg3)', border: `1.5px solid ${donateForm.amount == a ? 'var(--primary)' : 'var(--card-border)'}`, borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    ${a}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Custom Amount ($)</label>
                <input type="number" placeholder="Enter amount" min="1" value={donateForm.amount} onChange={e => setDonateForm({ ...donateForm, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select value={donateForm.payment_method} onChange={e => setDonateForm({ ...donateForm, payment_method: e.target.value })}>
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message (optional)</label>
                <textarea rows={3} placeholder="Share your reason for donating..." value={donateForm.message} onChange={e => setDonateForm({ ...donateForm, message: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={donateForm.is_anonymous} onChange={e => setDonateForm({ ...donateForm, is_anonymous: e.target.checked })} style={{ width: 'auto' }} />
                Donate anonymously
              </label>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={donating}>
                {donating ? 'Processing...' : `Donate $${donateForm.amount || '0'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
