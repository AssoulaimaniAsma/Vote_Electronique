import axios from 'axios';

// Instance unique — URL complète
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur requête — injecte le bon token selon le rôle
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token');
  const voterToken = localStorage.getItem('vs_token');
  const token = adminToken || voterToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse — redirection si token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isLoginRequest =
      url.includes('/auth/admin/login') ||
      url.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      // Déterminer vers quel login rediriger
      if (localStorage.getItem('admin_token')) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('vs_token');
        window.location.href = '/voter/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── API ADMIN ─────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/admin/login', { username, password }),
};

export const adminAPI = {
  getStats:       ()     => api.get('/admin/stats'),
  getElecteurs:   ()     => api.get('/admin/electeurs'),
  addElecteur:    (data) => api.post('/admin/electeurs', data),
  getCandidats:   ()     => api.get('/admin/candidats'),
  addCandidat:    (data) => api.post('/admin/candidats', data),
  deleteCandidat: (id)   => api.delete(`/admin/candidats/${id}`),
  depouillement:  ()     => api.post('/admin/depouillement'),
   getElection:      ()     => api.get('/admin/election'),          // ← nouveau
  terminerElection: ()     => api.post('/admin/election/terminer'), // ← nouveau
   validerElecteur: (id)  => api.put(`/admin/electeurs/${id}/valider`),   // ← ajouté
  refuserElecteur: (id)  => api.put(`/admin/electeurs/${id}/refuser`),  // ← ajouté
    getResultats: () => api.get('/admin/resultats'),

};

// ── API ÉLECTEUR ──────────────────────────────────────────
export const voterAuthAPI = {
  login:  (cin, password) => api.post('/auth/login', { cin, password }),
  logout: ()              => api.post('/auth/logout'),
  register: (data)        => api.post('/auth/register', data),   // ← ajouté

};

export const voterAPI = {
  getDashboard: () => api.get('/voter/dashboard'),
  getCandidates: () => api.get('/voter/candidates'),
  submitVote: (candidat_id) => api.post('/voter/vote', { candidat_id }),
    getResultats: () => api.get('/voter/resultats'),
    getElectionStatut: () => api.get('/voter/election/statut'),
getResultats:      () => api.get('/voter/resultats'),

};

export default api;