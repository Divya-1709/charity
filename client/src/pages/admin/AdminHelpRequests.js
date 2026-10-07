import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { helpAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const STATUS_OPTS = ['pending', 'under_review', 'approved', 'rejected', 'fulfilled'];
const BADGE_MAP = { pending: 'badge-warning', under_review: 'badge-info', approved: 'badge-success', rejected: 'badge-error', fulfilled: 'badge-success' };

export default function AdminHelpRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: '', admin_notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = () => {
    helpAPI.getAllAdmin({ status: filter || undefined }).then(res => setRequests(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchRequests, [filter]);

  const openReview = (r) => { setSelected(r); setReviewForm({ status: r.status, admin_notes: r.admin_notes || '' }); };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await helpAPI.review(selected.id, reviewForm);
      toast.success('Request updated!');
      setSelected(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Help Requests 🙏</h2><p>Review and manage beneficiary requests</p></div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 180 }}>
            <option value="">All Statuses</option>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="dashboard-content">
          <div className="table-wrapper">
            <div className="table-header"><h3>Requests ({requests.length})</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : requests.length === 0 ? (
              <div className="empty-state"><div className="icon">📋</div><h3>No requests found</h3></div>
            ) : (
              <table>
                <thead><tr><th>Title</th><th>Beneficiary</th><th>Category</th><th>Urgency</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500, maxWidth: 180 }}>{r.title}</td>
                      <td>
                        <div style={{ fontSize: 13 }}>{r.beneficiary_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.beneficiary_email}</div>
                      </td>
                      <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{r.category}</span></td>
                      <td><span className={`badge ${r.urgency === 'critical' ? 'badge-error' : r.urgency === 'high' ? 'badge-warning' : 'badge-info'}`}>{r.urgency}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{r.amount_needed ? `$${r.amount_needed}` : '-'}</td>
                      <td><span className={`badge ${BADGE_MAP[r.status] || 'badge-info'}`} style={{ textTransform: 'capitalize' }}>{r.status?.replace('_', ' ')}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td><button onClick={() => openReview(r)} className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}>Review</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Review Request</h3>
              <button className="modal-close" onClick={() => setSelected(null)}><FiX /></button>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <h4 style={{ marginBottom: 6 }}>{selected.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{selected.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{selected.category}</span>
                <span className={`badge ${selected.urgency === 'critical' ? 'badge-error' : 'badge-warning'}`}>{selected.urgency}</span>
                {selected.amount_needed && <span className="badge badge-info">${selected.amount_needed}</span>}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                <strong>Beneficiary:</strong> {selected.beneficiary_name} ({selected.beneficiary_email})
              </div>
            </div>
            <form onSubmit={handleReview}>
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select value={reviewForm.status} onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Notes (sent to beneficiary)</label>
                <textarea rows={3} placeholder="Optional message to the beneficiary..." value={reviewForm.admin_notes} onChange={e => setReviewForm({ ...reviewForm, admin_notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setSelected(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={submitting}>{submitting ? 'Saving...' : 'Update Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
