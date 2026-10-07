import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { donationsAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';

export default function DonorDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationsAPI.getMyDonations().then(res => setDonations(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const downloadReceipt = async (id) => {
    try {
      const res = await donationsAPI.getReceipt(id);
      const r = res.data.receipt;
      const content = `
HopeBridge Donation Receipt
=============================
Receipt #: ${r.receiptNumber}
Date: ${new Date(r.date).toLocaleString()}
Donor: ${r.donorName}
Email: ${r.donorEmail}
Campaign: ${r.campaign}
Amount: $${r.amount} ${r.currency}
Payment: ${r.paymentMethod}
Transaction ID: ${r.transactionId}
Status: ${r.status}

${r.message}
      `;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `receipt-${r.receiptNumber}.txt`; a.click();
      toast.success('Receipt downloaded!');
    } catch { toast.error('Could not fetch receipt.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>My Donations</h2><p>Complete history of your contributions</p></div>
        </div>
        <div className="dashboard-content">
          <div className="table-wrapper">
            <div className="table-header"><h3>All Donations ({donations.length})</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> :
              donations.length === 0 ? (
                <div className="empty-state"><div className="icon">💙</div><h3>No donations yet</h3></div>
              ) : (
                <table>
                  <thead><tr><th>Campaign</th><th>Amount</th><th>Method</th><th>Tx ID</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 500 }}>{d.campaign_title || '-'}</td>
                        <td><span style={{ color: 'var(--accent)', fontWeight: 700 }}>${d.amount}</span></td>
                        <td><span className="badge badge-info">{d.payment_method}</span></td>
                        <td style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.transaction_id}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(d.donated_at).toLocaleString()}</td>
                        <td><span className={`badge badge-${d.status === 'completed' ? 'success' : 'warning'}`}>{d.status}</span></td>
                        <td>
                          <button onClick={() => downloadReceipt(d.id)} className="btn btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }}>
                            <FiDownload size={12} /> Receipt
                          </button>
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
