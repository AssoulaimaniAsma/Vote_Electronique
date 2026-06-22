import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // ── État ÉLECTEUR ─────────────────────────────────────
  const [voterToken, setVoterToken] = useState(
    () => localStorage.getItem('vs_token')
  );
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('vs_user');
    return u ? JSON.parse(u) : null;
  });

  // ── État ADMIN ────────────────────────────────────────
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem('admin_token')
  );

  // ── Actions ÉLECTEUR ──────────────────────────────────
  const loginVoter = (token, userData) => {
    localStorage.setItem('vs_token', token);
    localStorage.setItem('vs_user', JSON.stringify(userData));
    setVoterToken(token);
    setUser(userData);
  };

  const logoutVoter = () => {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_user');
    localStorage.removeItem('vs_voted');
    setVoterToken(null);
    setUser(null);
  };

  const markVoted = (reference) => {
    const updated = { ...user, aVote: true, reference };
    localStorage.setItem('vs_user', JSON.stringify(updated));
    localStorage.setItem('vs_voted', 'true');
    setUser(updated);
  };

  // ── Actions ADMIN ─────────────────────────────────────
  const loginAdmin = (token) => {
    localStorage.setItem('admin_token', token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{
      // Électeur
      token: voterToken,
      user,
      login: loginVoter,       // ← son code appelle login() — on garde l'alias
      logout: logoutVoter,
      markVoted,
      isAuthenticated: !!voterToken,

      // Admin
      adminToken,
      loginAdmin,
      logoutAdmin,
      isAdminAuthenticated: !!adminToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);