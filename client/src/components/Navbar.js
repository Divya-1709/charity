import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FiHeart, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';

import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const dashboardLink = { admin: '/admin', donor: '/donor', volunteer: '/volunteer/dashboard', beneficiary: '/beneficiary' };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size={36} />
          <span>HopeBridge</span>
        </Link>
        <div className="navbar-nav">
          <Link to="/campaigns" className="nav-link">Campaigns</Link>
          <Link to="/volunteer" className="nav-link">Volunteer</Link>
          <Link to="/#about" className="nav-link">About</Link>
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to={dashboardLink[user.role] || '/dashboard'} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: 13 }}>
                <FiUser size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
                <FiLogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
