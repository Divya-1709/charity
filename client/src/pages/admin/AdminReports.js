import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6C63FF', '#FF6584', '#43C6AC', '#F7971E', '#3B82F6', '#22C55E'];

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReports().then(res => setReports(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-layout"><Sidebar />
      <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--primary)', fontSize: 20 }}>Loading reports...</div></main>
    </div>
  );

  const categoryData = (reports?.categoryBreakdown || []).map((c, i) => ({ name: c.category, value: parseInt(c.count), fill: COLORS[i % COLORS.length] }));
  const topCampaigns = reports?.topCampaigns || [];
  const topDonors = reports?.topDonors || [];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Reports & Analytics 📊</h2><p>Platform performance and impact insights</p></div>
        </div>
        <div className="dashboard-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Top Campaigns */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ marginBottom: 20, fontSize: 15 }}>Top Campaigns by Donations</h3>
              {topCampaigns.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topCampaigns.map(c => ({ name: c.title.substring(0, 15) + '...', raised: parseFloat(c.raised_amount || 0) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: '#8888AA', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#8888AA', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1A1B35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E8E8F0' }} />
                    <Bar dataKey="raised" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>}
            </div>

            {/* Help request categories */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ marginBottom: 20, fontSize: 15 }}>Help Requests by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1A1B35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E8E8F0' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No requests yet</div>}
            </div>
          </div>

          {/* Top Donors Table */}
          <div className="table-wrapper">
            <div className="table-header"><h3>🏆 Top Donors</h3></div>
            {topDonors.length === 0 ? (
              <div className="empty-state"><div className="icon">💙</div><h3>No donations yet</h3></div>
            ) : (
              <table>
                <thead><tr><th>#</th><th>Donor</th><th>Email</th><th>Total Donated</th><th>Donations Count</th></tr></thead>
                <tbody>
                  {topDonors.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i < 3 ? '#000' : 'var(--text-muted)' }}>{i + 1}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{d.name?.[0]}</div>
                          <span style={{ fontWeight: 500 }}>{d.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{d.email}</td>
                      <td><span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>${parseFloat(d.total_donated || 0).toLocaleString()}</span></td>
                      <td><span className="badge badge-primary">{d.donation_count} donations</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
