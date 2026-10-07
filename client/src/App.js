import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import VolunteerPage from './pages/VolunteerPage';

// Donor pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorDonations from './pages/donor/DonorDonations';

// Volunteer pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

// Beneficiary pages
import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHelpRequests from './pages/admin/AdminHelpRequests';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminReports from './pages/admin/AdminReports';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#6C63FF', fontSize: 24 }}>Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const RoleDashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const dashboards = { admin: '/admin', donor: '/donor', volunteer: '/volunteer', beneficiary: '/beneficiary' };
  return <Navigate to={dashboards[user.role] || '/'} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/dashboard" element={<RoleDashboard />} />

        {/* Donor */}
        <Route path="/donor" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/donations" element={<ProtectedRoute roles={['donor']}><DonorDonations /></ProtectedRoute>} />

        {/* Volunteer */}
        <Route path="/volunteer/dashboard" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />

        {/* Beneficiary */}
        <Route path="/beneficiary" element={<ProtectedRoute roles={['beneficiary']}><BeneficiaryDashboard /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/campaigns" element={<ProtectedRoute roles={['admin']}><AdminCampaigns /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/help-requests" element={<ProtectedRoute roles={['admin']}><AdminHelpRequests /></ProtectedRoute>} />
        <Route path="/admin/volunteers" element={<ProtectedRoute roles={['admin']}><AdminVolunteers /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
