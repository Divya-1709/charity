import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: 20 }}>Loading dashboard...</div>
      </main>
    </div>
  );

  const usersByRole = stats?.users || [];
  const donorCount = usersByRole.find(u => u.role === 'donor')?.total || 0;
  const volunteerCount = usersByRole.find(u => u.role === 'volunteer')?.total || 0;
  const beneficiaryCount = usersByRole.find(u => u.role === 'beneficiary')?.total || 0;
  const totalUsers = usersByRole.reduce((s, u) => s + parseInt(u.total), 0);
  const totalDonations = stats?.donations?.total_amount || 0;
  const activeCampaigns = stats?.campaigns?.find(c => c.status === 'active')?.total || 0;
  const pendingRequests = stats?.helpRequests?.find(r => r.status === 'pending')?.total || 0;

  const chartData = (stats?.monthlyDonations || []).map(m => ({
    month: new Date(m.month).toLocaleString('default', { month: 'short' }),
    amount: parseFloat(m.total || 0).toFixed(0),
  }));

  const roleData = [
    { name: 'Donors', count: parseInt(donorCount) },
    { name: 'Volunteers', count: parseInt(volunteerCount) },
    { name: 'Beneficiaries', count: parseInt(beneficiaryCount) },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Admin Dashboard 🛡️</h2><p>Platform overview and key metrics</p></div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleString()}</div>
        </div>
        <div className="dashboard-content">
          <div className="stat-cards">
            <div className="stat-card primary"><div className="stat-card-icon">👥</div><h3>{totalUsers}</h3><p>Total Users</p></div>
            <div className="stat-card success"><div className="stat-card-icon">💰</div><h3>${parseFloat(totalDonations).toLocaleString()}</h3><p>Total Donated</p></div>
            <div className="stat-card warning"><div className="stat-card-icon">🚀</div><h3>{activeCampaigns}</h3><p>Active Campaigns</p></div>
            <div className="stat-card error"><div className="stat-card-icon">📋</div><h3>{pendingRequests}</h3><p>Pending Requests</p></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Monthly donations chart */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ marginBottom: 20, fontSize: 15 }}>Monthly Donations (6mo)</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" tick={{ fill: '#8888AA', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#8888AA', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#1A1B35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E8E8F0' }} />
                    <Bar dataKey="amount" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>
              )}
            </div>

            {/* Users by role chart */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ marginBottom: 20, fontSize: 15 }}>Users by Role</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" tick={{ fill: '#8888AA', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#8888AA', fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ background: '#1A1B35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E8E8F0' }} />
                  <Bar dataKey="count" fill="#43C6AC" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { to: '/admin/users', icon: '👥', label: 'Manage Users', color: 'var(--primary)' },
              { to: '/admin/campaigns', icon: '🚀', label: 'Manage Campaigns', color: 'var(--accent)' },
              { to: '/admin/help-requests', icon: '🙏', label: 'Review Requests', color: 'var(--secondary)' },
              { to: '/admin/volunteers', icon: '🤝', label: 'Manage Volunteers', color: 'var(--warning)' },
              { to: '/admin/reports', icon: '📊', label: 'View Reports', color: '#8B85FF' },
            ].map(item => (
              <a key={item.to} href={item.to} style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '20px 16px', textAlign: 'center', display: 'block', transition: 'all 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = item.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.label}</div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
