import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import Logo from '../components/Logo';

const ROLES = [
  { value: 'donor', label: 'Donor', emoji: '💙', desc: 'Support causes with donations' },
  { value: 'volunteer', label: 'Volunteer', emoji: '🤝', desc: 'Give your time & skills' },
  { value: 'beneficiary', label: 'Beneficiary', emoji: '🌟', desc: 'Request assistance & support' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const dashboards = { donor: '/donor', volunteer: '/volunteer/dashboard', beneficiary: '/beneficiary' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const res = await register(form);
      toast.success(`Welcome to HopeBridge, ${res.user.name}! 🎉`);
      navigate(dashboards[res.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="brand">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Logo size={48} />
          </div>
          <h1>Join HopeBridge</h1>
          <p>Create your account and start making a difference</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I want to join as...</label>
            <div className="role-selector">
              {ROLES.map(r => (
                <div key={r.value} className={`role-option${form.role === r.value ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}>
                  <span>{r.emoji}</span>{r.label}
                </div>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ paddingLeft: 44 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-phone" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ paddingLeft: 44 }} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ paddingLeft: 44 }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="reg-password" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingLeft: 44 }} />
            </div>
          </div>
          <button id="reg-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13, marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating Account...' : <><FiArrowRight /> Create Account</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
