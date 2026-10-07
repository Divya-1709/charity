import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiShield, FiHeart, FiUsers, FiHome } from 'react-icons/fi';
import Logo from '../components/Logo';

const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@hopebridge.org',
    password: 'admin123',
    icon: <FiShield />,
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE',
    desc: 'Manage all platform operations'
  },
  {
    role: 'donor',
    label: 'Donor',
    email: 'donor@hopebridge.org',
    password: 'donor123',
    icon: <FiHeart />,
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
    desc: 'Make donations & download receipts'
  },
  {
    role: 'volunteer',
    label: 'Volunteer',
    email: 'volunteer@hopebridge.org',
    password: 'volunteer123',
    icon: <FiUsers />,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    desc: 'Apply for events & earn certificates'
  },
  {
    role: 'beneficiary',
    label: 'Beneficiary',
    email: 'beneficiary@hopebridge.org',
    password: 'beneficiary123',
    icon: <FiHome />,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    desc: 'Request food, medical & shelter aid'
  }
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [quickLoadingRole, setQuickLoadingRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const dashboards = {
    admin: '/admin',
    donor: '/donor',
    volunteer: '/volunteer/dashboard',
    beneficiary: '/beneficiary'
  };

  const handleDirectLogin = async (acc) => {
    setQuickLoadingRole(acc.role);
    setForm({ email: acc.email, password: acc.password });
    try {
      const res = await login(acc.email, acc.password);
      toast.success(`Logged in as ${acc.label} (${res.user.name})! 🚀`);
      navigate(dashboards[res.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to log in as ${acc.label}.`);
    } finally {
      setQuickLoadingRole(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      toast.success(`Welcome back, ${res.user.name}! 👋`);
      navigate(dashboards[res.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="brand">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Logo size={48} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your HopeBridge account</p>
        </div>

        {/* 1-Click Direct Login Buttons */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            ⚡ 1-Click Direct Demo Login
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10
          }}>
            {DEMO_ACCOUNTS.map(acc => {
              const isLoggingIn = quickLoadingRole === acc.role;
              return (
                <button
                  key={acc.role}
                  id={`quick-login-${acc.role}`}
                  type="button"
                  onClick={() => handleDirectLogin(acc)}
                  disabled={loading || quickLoadingRole !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: acc.bg,
                    border: `1.5px solid ${acc.border}`,
                    color: 'var(--text)',
                    cursor: (loading || quickLoadingRole !== null) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    opacity: quickLoadingRole && quickLoadingRole !== acc.role ? 0.5 : 1
                  }}
                  onMouseEnter={e => {
                    if (!quickLoadingRole) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 16px rgba(0,0,0,0.06)`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{
                    color: acc.color,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {acc.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: acc.color,
                      lineHeight: 1.2
                    }}>
                      {isLoggingIn ? 'Logging in...' : `${acc.label}`}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {acc.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '20px 0',
          color: 'var(--text-muted)',
          fontSize: 12
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
          <span>OR SIGN IN MANUALLY</span>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
        </div>

        {/* Manual form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
          </div>
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }}
            disabled={loading || quickLoadingRole !== null}
          >
            {loading ? 'Signing in...' : <><FiArrowRight /> Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
