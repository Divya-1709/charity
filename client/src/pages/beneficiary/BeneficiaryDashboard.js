import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../AuthContext';
import { helpAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiUpload } from 'react-icons/fi';

const CATEGORIES = ['food', 'education', 'medical', 'shelter', 'clothing', 'other'];
const URGENCY = ['low', 'medium', 'high', 'critical'];
const STATUS_BADGE = { pending: 'badge-warning', under_review: 'badge-info', approved: 'badge-success', rejected: 'badge-error', fulfilled: 'badge-success' };

export default function BeneficiaryDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'food', urgency: 'medium', amount_needed: '' });
  const [file, setFile] = useState(null);

  const fetchRequests = () => {
    helpAPI.getMy().then(res => setRequests(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchRequests, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (file) fd.append('document', file);
      await helpAPI.submit(fd);
      toast.success('Help request submitted! Our team will review it shortly.');
      setShowForm(false);
      setForm({ title: '', description: '', category: 'food', urgency: 'medium', amount_needed: '' });
      setFile(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>My Help Requests 🌟</h2><p>Welcome, {user?.name}. Track your assistance requests here.</p></div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> New Request</button>
        </div>
        <div className="dashboard-content">
          <div className="stat-cards">
            <div className="stat-card primary"><div className="stat-card-icon">📋</div><h3>{requests.length}</h3><p>Total Requests</p></div>
            <div className="stat-card warning"><div className="stat-card-icon">⏳</div><h3>{requests.filter(r => r.status === 'pending').length}</h3><p>Pending</p></div>
            <div className="stat-card success"><div className="stat-card-icon">✅</div><h3>{requests.filter(r => r.status === 'approved' || r.status === 'fulfilled').length}</h3><p>Approved/Fulfilled</p></div>
          </div>

          <div className="table-wrapper">
            <div className="table-header"><h3>Request History</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> :
              requests.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🙏</div>
                  <h3>No requests yet</h3>
                  <p>Submit a help request and our team will assist you.</p>
                  <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ marginTop: 16 }}>Submit Request</button>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Title</th><th>Category</th><th>Urgency</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 500 }}>{r.title}</td>
                        <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{r.category}</span></td>
                        <td><span className={`badge ${r.urgency === 'critical' ? 'badge-error' : r.urgency === 'high' ? 'badge-warning' : 'badge-info'}`}>{r.urgency}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{r.amount_needed ? `$${r.amount_needed}` : '-'}</td>
                        <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-info'}`} style={{ textTransform: 'capitalize' }}>{r.status?.replace('_', ' ')}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
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
              <h3>🙏 Submit Help Request</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Request Title *</label>
                <input placeholder="Brief description of your need" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency *</label>
                  <select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}>
                    {URGENCY.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Detailed Description *</label>
                <textarea rows={4} placeholder="Explain your situation in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount Needed ($) - optional</label>
                <input type="number" placeholder="Estimated amount needed" value={form.amount_needed} onChange={e => setForm({ ...form, amount_needed: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Supporting Document (optional)</label>
                <div style={{ border: '2px dashed var(--card-border)', borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('doc-upload').click()}>
                  <FiUpload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{file ? file.name : 'Click to upload document (max 5MB)'}</p>
                  <input id="doc-upload" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
