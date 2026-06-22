import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages Admin
import AdminLogin       from './pages/Admin/Login';
import AdminDashboard   from './pages/Admin/Dashboard';
import Gestion          from './pages/Admin/Gestion';
import Depouillement    from './pages/Admin/Depouillement';

// Pages Électeur
import VoterLogin       from './pages/Voter/Login';
import VoterDashboard   from './pages/Voter/Dashboard';
import CandidateList    from './pages/Voter/CandidateList';
import VoteConfirm      from './pages/Voter/VoteConfirm';
import VoteSuccess      from './pages/Voter/VoteSuccess';
import VoterRegister from './pages/Voter/Register';
import VoterResultats from './pages/Voter/Voterresultats';

// Guards
import PrivateRoute     from './components/PrivateRoute';

// Guard électeur — redirige si déjà voté
function VoteGuard({ children }) {
  const { user } = useAuth();
  if (user?.aVote) return <Navigate to="/voter/success" replace />;
  return children;
}

// Redirection racine selon rôle
function RoleRedirect() {
  const adminToken = localStorage.getItem('admin_token');
  const voterToken = localStorage.getItem('vs_token');
  if (adminToken) return <Navigate to="/admin/dashboard" replace />;
  if (voterToken) return <Navigate to="/voter/dashboard" replace />;
  return <Navigate to="/voter/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Racine — redirection auto */}
      <Route path="/" element={<RoleRedirect />} />

      {/* ── Routes ADMIN ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>
      }/>
      <Route path="/admin/gestion" element={
        <PrivateRoute role="ADMIN"><Gestion /></PrivateRoute>
      }/>
      <Route path="/admin/depouillement" element={
        <PrivateRoute role="ADMIN"><Depouillement /></PrivateRoute>
      }/>

      {/* ── Routes ÉLECTEUR ── */}
      <Route path="/voter/login" element={<VoterLogin />} />
      <Route path="/voter/register" element={<VoterRegister />} />

      <Route path="/voter/dashboard" element={
        <PrivateRoute role="VOTER"><VoterDashboard /></PrivateRoute>
      }/>
      <Route path="/voter/candidats" element={
        <PrivateRoute role="VOTER">
          <VoteGuard><CandidateList /></VoteGuard>
        </PrivateRoute>
      }/>
      <Route path="/voter/confirm" element={
        <PrivateRoute role="VOTER">
          <VoteGuard><VoteConfirm /></VoteGuard>
        </PrivateRoute>
      }/>
      <Route path="/voter/success" element={
        <PrivateRoute role="VOTER"><VoteSuccess /></PrivateRoute>
      }/>
      <Route path="/voter/resultats" element={
  <PrivateRoute role="VOTER"><VoterResultats /></PrivateRoute>
} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}