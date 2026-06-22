import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { voterAPI, voterAuthAPI } from '../../services/api';
import NavHeader from '../../components/NavHeader';

export default function VoterResultats() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    voterAPI.getResultats()
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Erreur lors du chargement des résultats.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await voterAuthAPI.logout(); } catch {}
    logout();
    navigate('/voter/login', { replace: true });
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fc', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Navbar */}
      <div style={{ width: '100%', background: '#072F75' }}>
        <NavHeader currentStep={4} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px' }}>

        {loading && (
          <div style={{ marginTop: 80, fontSize: 14, color: '#6B7280' }}>Chargement des résultats...</div>
        )}

        {error && (
          <div style={{ marginTop: 80, maxWidth: 480, width: '100%', background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 12, padding: '28px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#DC2626', marginBottom: 8 }}>Résultats non disponibles</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{error}</div>
          </div>
        )}

        {data && (
          <div style={{ width: '100%', maxWidth: 680 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🗳️</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#072F75', margin: '0 0 6px' }}>
                Résultats officiels
              </h1>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{data.election}</p>
            </div>

            {/* Stats globales */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Votes exprimés', val: data.totalVotes, color: '#EFF6FF', tc: '#072F75' },
                { label: 'Candidats',      val: data.resultats.length, color: '#F5F0FF', tc: '#534AB7' },
                { label: 'Vainqueur',      val: data.resultats[0]?.nom || '—', color: '#E1F5EE', tc: '#0F6E56' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: s.color, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: s.label === 'Vainqueur' ? 14 : 22, fontWeight: 600, color: s.tc }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Liste des candidats */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 18 }}>
                Classement final
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {data.resultats.map((c, i) => (
                  <div key={c.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                      <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>
                        {medals[i] || `${i + 1}.`}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{
                            fontSize: 14, fontWeight: i === 0 ? 700 : 500,
                            color: i === 0 ? '#072F75' : '#0f172a'
                          }}>
                            {c.nom}
                            {i === 0 && (
                              <span style={{
                                marginLeft: 8, fontSize: 11, fontWeight: 600,
                                background: '#E1F5EE', color: '#0F6E56',
                                borderRadius: 4, padding: '2px 7px'
                              }}>
                                Élu
                              </span>
                            )}
                          </span>
                          <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                            {c.nbVotes} vote{c.nbVotes !== 1 ? 's' : ''} · {c.pourcentage}%
                          </span>
                        </div>
                        {/* Barre de progression */}
                        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${c.pourcentage}%`,
                            background: i === 0 ? '#072F75' : i === 1 ? '#534AB7' : '#9CA3AF',
                            borderRadius: 4,
                            transition: 'width 0.6s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton déconnexion */}
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button
                onClick={handleLogout}
                style={{
                  background: '#072F75', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '11px 32px', fontSize: 14,
                  fontWeight: 500, cursor: 'pointer'
                }}>
                Se déconnecter
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}