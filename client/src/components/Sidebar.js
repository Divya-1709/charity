import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  FiGrid, FiHeart, FiUsers, FiFileText, FiBarChart2,
  FiUser, FiLogOut, FiFlag, FiCheckSquare
} from 'react-icons/fi';

import Logo from './Logo';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, exact: true },
  { to: '/admin/campaigns', label: 'Campaigns', icon: <FiFlag /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/help-requests', label: 'Help Requests', icon: <FiFileText /> },
  { to: '/admin/volunteers', label: 'Volunteers', icon: <FiCheckSquare /> },
  { to: '/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
];

const donorLinks = [
  { to: '/donor', label: 'Dashboard', icon: <FiGrid />, exact: true },
  { to: '/donor/donations', label: 'My Donations', icon: <FiHeart /> },
  { to: '/campaigns', label: 'Browse Campaigns', icon: <FiFlag /> },
];

const volunteerLinks = [
  { to: '/volunteer/dashboard', label: 'Dashboard', icon: <FiGrid />, exact: true },
  { to: '/volunteer', label: 'Opportunities', icon: <FiCheckSquare /> },
];

const beneficiaryLinks = [
  { to: '/beneficiary', label: 'Dashboard', icon: <FiGrid />, exact: true },
];

const roleLinks = { admin: adminLinks, donor: donorLinks, volunteer: volunteerLinks, beneficiary: beneficiaryLinks };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = roleLinks[user?.role] || [];

  const isActive = (link) => link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={32} />
        <span>HopeBridge</span>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {links.map(link => (
          <Link key={link.to} to={link.to} className={`sidebar-link${isActive(link) ? ' active' : ''}`}>
            {link.icon} {link.label}
          </Link>
        ))}
        <div className="sidebar-section-label" style={{ marginTop: 20 }}>Account</div>
        <Link to="/" className="sidebar-link"><FiUser /> Profile</Link>
      </nav>
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
          <FiLogOut /> Sign Out
        </button>
      </div>
    </aside>
  );
}
