import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    adminAPI.getUsers({ role: roleFilter || undefined }).then(res => { setUsers(res.data.users || []); setTotal(res.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [roleFilter]);

  const toggleUser = async (id, field, val) => {
    try {
      const user = users.find(u => u.id === id);
      await adminAPI.updateUser(id, { is_verified: user.is_verified, is_active: user.is_active, [field]: val });
      setUsers(u => u.map(u => u.id === id ? { ...u, [field]: val } : u));
      toast.success('User updated!');
    } catch { toast.error('Failed to update user.'); }
  };

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div><h2>Users 👥</h2><p>Manage and verify platform users</p></div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Total: {total}</div>
        </div>
        <div className="dashboard-content">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <FiSearch className="search-icon" size={16} />
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 160 }}>
              <option value="">All Roles</option>
              <option value="donor">Donors</option>
              <option value="volunteer">Volunteers</option>
              <option value="beneficiary">Beneficiaries</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="table-wrapper">
            <div className="table-header"><h3>Users ({filtered.length})</h3></div>
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Verified</th><th>Active</th></tr></thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{u.name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-error' : u.role === 'donor' ? 'badge-info' : u.role === 'volunteer' ? 'badge-success' : 'badge-warning'}`}>{u.role}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => toggleUser(u.id, 'is_verified', !u.is_verified)} style={{ background: u.is_verified ? 'rgba(34,197,94,0.15)' : 'var(--bg3)', border: `1.5px solid ${u.is_verified ? 'rgba(34,197,94,0.3)' : 'var(--card-border)'}`, color: u.is_verified ? '#4ADE80' : 'var(--text-muted)', padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s' }}>
                          {u.is_verified ? '✓ Verified' : 'Verify'}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => toggleUser(u.id, 'is_active', !u.is_active)} style={{ background: u.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1.5px solid ${u.is_active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: u.is_active ? '#4ADE80' : '#F87171', padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s' }}>
                          {u.is_active ? 'Active' : 'Inactive'}
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
