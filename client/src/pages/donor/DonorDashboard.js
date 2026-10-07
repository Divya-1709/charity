import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../AuthContext';
import { donationsAPI } from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { FiHeart, FiDollarSign, FiList, FiArrowRight } from 'react-icons/fi';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    donationsAPI.getMyDonations().then(res => setDonations(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalDonated = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2>Welcome back, {user?.name}! 👋</h2>
            <p>Your generosity creates lasting change in communities.</p>
          </div>
          <Link to="/campaigns" className="btn btn-primary"><FiHeart /> Donate Again</Link>
        </div>
        <div className="dashboard-content">
          <div className="stat-cards">
            <div className="stat-card primary">
              <div className="stat-card-icon">💰</div>
              <h3>${totalDonated.toLocaleString()}</h3>
              <p>Total Donated</p>
            </div>
            <div className="stat-card success">
              <div className="stat-card-icon">🎯</div>
              <h3>{donations.length}</h3>
              <p>Donations Made</p>
            </div>
            <div className="stat-card warning">
              <div className="stat-card-icon">📊</div>
              <h3>{new Set(donations.map(d => d.campaign_id)).size}</h3>
              <p>Campaigns Supported</p>
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-header">
              <h3>Recent Donations</h3>
              <Link to="/donor/donations" className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>View All <FiArrowRight /></Link>
            </div>
            {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div> :
              donations.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">💙</div>
                  <h3>No donations yet</h3>
                  <p>Make your first donation to a campaign!</p>
                  <Link to="/campaigns" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Campaigns</Link>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Campaign</th><th>Amount</th><th>Method</th><th>Date</th><th>Receipt</th></tr></thead>
                  <tbody>
                    {donations.slice(0, 5).map(d => (
                      <tr key={d.id}>
                        <td>{d.campaign_title || 'Unknown'}</td>
                        <td><span style={{ color: 'var(--accent)', fontWeight: 600 }}>${d.amount}</span></td>
                        <td><span className="badge badge-info">{d.payment_method}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(d.donated_at).toLocaleDateString()}</td>
                        <td>
                          <button onClick={async () => {
                            const res = await donationsAPI.getReceipt(d.id);
                            alert(JSON.stringify(res.data.receipt, null, 2));
                          }} className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }}>📄 Receipt</button>
                        </td>
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
