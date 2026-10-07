import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../api';
import { campaignsAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiEdit2 } from 'react-icons/fi';

const CATEGORIES = ['education', 'medical', 'food', 'shelter', 'environment', 'emergency', 'community'];

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'education', goal_amount: '', image_url: '', start_date: '', end_date: '', status: 'active' });

  const fetchCampaigns = () => {
    campaignsAPI.getAll({ limit: 100, status: '' }).then(res => setCampaigns(res.data.campaigns || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchCampaigns, []);

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', category: 'education', goal_amount: '', image_url: '', start_date: '', end_date: '', status: 'active' }); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ title: c.title, description: c.description, category: c.category, goal_amount: c.goal_amount, image_url: c.image_url || '', start_date: c.start_date?.split('T')[0], end_date: c.end_date?.split('T')[0], status: c.status }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await campaignsAPI.update(editing.id, form);
        toast.success('Campaign updated!');
      } else {
        await campaignsAPI.create(form);
        toast.success('Campaign created!');
      }
      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Campaigns 🚀</h2><p>Create and manage fundraising campaigns</p></div>
          <button onClick={openCreate} className="btn btn-primary"><FiPlus /> New Campaign</button>
        </div>
        <div className="dashboard-content">
          <div className="table-wrapper">
            <div className="table-header"><h3>All Campaigns ({campaigns.length})</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {campaigns.map(c => {
                    const pct = Math.min(100, c.progress_percent || 0);
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 500, maxWidth: 200 }}>{c.title}</td>
                        <td><span className="badge badge-primary">{c.category}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>${Number(c.goal_amount).toLocaleString()}</td>
                        <td style={{ color: 'var(--accent)', fontWeight: 600 }}>${Number(c.raised_amount || 0).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="progress-bar" style={{ width: 80, marginBottom: 0 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                            <span style={{ fontSize: 12 }}>{pct}%</span>
                          </div>
                        </td>
                        <td><span className={`badge ${c.status === 'active' ? 'badge-success' : c.status === 'completed' ? 'badge-info' : 'badge-warning'}`}>{c.status}</span></td>
                        <td><button onClick={() => openEdit(c)} className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}><FiEdit2 size={12} /> Edit</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>{editing ? '✏️ Edit Campaign' : '🚀 New Campaign'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Title *</label><input placeholder="Campaign title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Description *</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Goal Amount ($)</label><input type="number" value={form.goal_amount} onChange={e => setForm({ ...form, goal_amount: e.target.value })} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Image URL (optional)</label><input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">End Date</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required /></div>
              </div>
              {editing && <div className="form-group"><label className="form-label">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Update Campaign' : 'Create Campaign'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
