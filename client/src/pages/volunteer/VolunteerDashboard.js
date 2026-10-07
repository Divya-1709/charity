import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../AuthContext';
import { volunteersAPI } from '../../api';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiXCircle, FiAward } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending: { badge: 'badge-warning', icon: <FiClock /> },
  approved: { badge: 'badge-info', icon: <FiCheckCircle /> },
  rejected: { badge: 'badge-error', icon: <FiXCircle /> },
  completed: { badge: 'badge-success', icon: <FiAward /> },
};

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    volunteersAPI.getMyApplications().then(res => setApplications(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    completed: applications.filter(a => a.status === 'completed').length,
    pending: applications.filter(a => a.status === 'pending').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Volunteer Hub 🤝</h2><p>Welcome back, {user?.name}! Track your volunteer activities.</p></div>
          <Link to="/volunteer" className="btn btn-primary">Find Opportunities</Link>
        </div>
        <div className="dashboard-content">
          <div className="stat-cards">
            <div className="stat-card primary"><div className="stat-card-icon">📋</div><h3>{stats.total}</h3><p>Applications</p></div>
            <div className="stat-card warning"><div className="stat-card-icon">⏳</div><h3>{stats.pending}</h3><p>Pending</p></div>
            <div className="stat-card success"><div className="stat-card-icon">✅</div><h3>{stats.approved}</h3><p>Approved</p></div>
            <div className="stat-card error"><div className="stat-card-icon">🏆</div><h3>{stats.completed}</h3><p>Completed</p></div>
          </div>

          {stats.completed > 0 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(67,198,172,0.1))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 16, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 48 }}>🏆</div>
              <div>
                <h3 style={{ marginBottom: 4 }}>Certificate Available!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>You've completed {stats.completed} volunteer activities. Check your notifications for certificates.</p>
              </div>
            </div>
          )}

          <div className="table-wrapper">
            <div className="table-header"><h3>My Applications</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> :
              applications.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🤝</div>
                  <h3>No applications yet</h3>
                  <p>Browse opportunities and start volunteering!</p>
                  <Link to="/volunteer" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Opportunities</Link>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Opportunity</th><th>Category</th><th>Location</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {applications.map(a => {
                      const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                      return (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 500 }}>{a.title}</td>
                          <td><span className="badge badge-primary">{a.category}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{a.location || '-'}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{a.event_date ? new Date(a.event_date).toLocaleDateString() : '-'}</td>
                          <td><span className={`badge ${cfg.badge}`} style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>{cfg.icon} {a.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
