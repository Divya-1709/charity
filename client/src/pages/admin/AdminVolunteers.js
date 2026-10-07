import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { volunteersAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';

const CATEGORIES = ['Teaching', 'Healthcare', 'Environment', 'Construction', 'Food Distribution', 'IT Support', 'Other'];

export default function AdminVolunteers() {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Teaching', location: '', event_date: '', event_time: '', slots_available: '', requirements: '' });

  const fetchAll = () => {
    Promise.all([
      volunteersAPI.getAllAdmin().then(res => setApplications(res.data || [])),
      volunteersAPI.getOpportunities({}).then(res => setOpportunities(res.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchAll, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await volunteersAPI.createOpportunity(form);
      toast.success('Opportunity created!');
      setShowCreate(false);
      fetchAll();
    } catch (err) { toast.error('Failed.'); } finally { setSubmitting(false); }
  };

  const updateApplication = async (id, status) => {
    try {
      await volunteersAPI.updateApplication(id, { status });
      toast.success(`Application ${status}!`);
      fetchAll();
    } catch { toast.error('Failed.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Volunteers 🤝</h2><p>Manage opportunities and applications</p></div>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary"><FiPlus /> New Opportunity</button>
        </div>
        <div className="dashboard-content">
          <h3 style={{ marginBottom: 16 }}>Opportunities ({opportunities.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
            {opportunities.map(o => (
              <div key={o.id} style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="badge badge-primary">{o.category}</span>
                  <span className={`badge ${o.status === 'open' ? 'badge-success' : 'badge-warning'}`}>{o.status}</span>
                </div>
                <h4 style={{ marginBottom: 6 }}>{o.title}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{o.description}</p>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {o.location || 'TBD'} | 👥 {o.slots_filled}/{o.slots_available} filled</div>
              </div>
            ))}
          </div>

          <div className="table-wrapper">
            <div className="table-header"><h3>All Applications ({applications.length})</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
              <table>
                <thead><tr><th>Volunteer</th><th>Opportunity</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {applications.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div>{a.volunteer_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.volunteer_email}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{a.opportunity_title}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(a.applied_at).toLocaleDateString()}</td>
                      <td><span className={`badge ${a.status === 'pending' ? 'badge-warning' : a.status === 'approved' ? 'badge-info' : a.status === 'completed' ? 'badge-success' : 'badge-error'}`}>{a.status}</span></td>
                      <td>
                        {a.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => updateApplication(a.id, 'approved')} className="btn btn-success" style={{ fontSize: 11, padding: '4px 10px' }}>Approve</button>
                            <button onClick={() => updateApplication(a.id, 'rejected')} className="btn btn-danger" style={{ fontSize: 11, padding: '4px 10px' }}>Reject</button>
                          </div>
                        )}
                        {a.status === 'approved' && (
                          <button onClick={() => updateApplication(a.id, 'completed')} className="btn btn-accent" style={{ fontSize: 11, padding: '4px 10px' }}>Mark Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>🤝 New Volunteer Opportunity</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}><FiX /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label className="form-label">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Description *</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Slots Available</label><input type="number" value={form.slots_available} onChange={e => setForm({ ...form, slots_available: e.target.value })} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Event Date</label><input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Event Time</label><input type="time" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Requirements</label><textarea rows={2} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={submitting}>{submitting ? 'Creating...' : 'Create Opportunity'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
