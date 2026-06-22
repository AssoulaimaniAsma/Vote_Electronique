import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children, role = 'ADMIN' }) {
  const location = useLocation();

  // Choisir le bon token selon le rôle
  const tokenKey = role === 'ADMIN' ? 'admin_token' : 'vs_token';
  const loginPath = role === 'ADMIN' ? '/admin/login' : '/voter/login';
  const token = localStorage.getItem(tokenKey);

  // Pas de token → login
  if (!token) {
    return <Navigate to={loginPath} replace
      state={{ message: "Vous devez être connecté pour accéder à cette page." }}
    />;
  }

  // Vérifier expiration + rôle dans le payload JWT
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Token expiré
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(tokenKey);
      return <Navigate to={loginPath} replace
        state={{ message: "Votre session a expiré. Veuillez vous reconnecter." }}
      />;
    }

    // Mauvais rôle — ex: électeur essaie d'accéder à /admin
    if (payload.role && payload.role !== role) {
      return <Navigate to={loginPath} replace
        state={{ message: "Accès non autorisé." }}
      />;
    }

  } catch {
    localStorage.removeItem(tokenKey);
    return <Navigate to={loginPath} replace
      state={{ message: "Session invalide. Veuillez vous reconnecter." }}
    />;
  }

  return children;
}