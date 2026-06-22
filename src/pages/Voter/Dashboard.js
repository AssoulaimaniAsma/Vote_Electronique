import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { voterAPI  } from '../../services/api';
import NavHeader from '../../components/NavHeader';

/* --- DÉFINITION DES ICÔNES PROFESSIONNELLES SVG POUR LE TABLEAU DE BORD --- */
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconMask = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconPen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconUrn = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22h10v-4H2v4h10zM12 6V1.5M12 14v4M4 18h16V10H4v8zM8 6h8v4H8V6z"></path>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
/* ------------------------------------------------------------------------ */

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
voterAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setError('Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);
  // Ajouter dans useEffect du dashboard
useEffect(() => {
  voterAPI.getElectionStatut().then(res => {
    if (res.data.statut === 'DEPOUILLE') {
      navigate('/voter/resultats', { replace: true });
    }
  }).catch(() => {});
}, []);
  return (
    <div className="page-inner" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
      
{/* On met le fond extérieur en bleu professionnel pour enlever les coins sombres sur les côtés */}
<div style={{ width: '100%', backgroundColor: '#0066cc', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
  <div style={{ width: '100%', backgroundColor: '#0066cc' }}>
    <NavHeader currentStep={1} />
  </div>
</div>
      <div 
        className="main-content fade-in"
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          borderRadius: '12px',
          maxWidth: 820,
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: '#000000',
          marginTop: '12px',
          width: '90%',
          boxSizing: 'border-box'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555555' }}>
            <div className="spinner" style={{ margin: '0 auto', borderTopColor: '#0066cc' }} />
            <div style={{ marginTop: 16 }}>Chargement...</div>
          </div>
        ) : error ? (
          <div className="alert alert-error" style={{ color: '#ff3333' }}>{error}</div>
        ) : data && (
          <>
            <div style={{ marginBottom: 32, textAlign: 'left' }}>
              <h1 style={{ color: '#000000', margin: 0 }}>Bienvenue, {data.electeur?.nom} {data.electeur?.prenom}👋</h1>
              <p style={{ color: '#555555', marginTop: 8, fontSize: 15 }}>
                Vous participez à l'élection en cours. Votre vote est sécurisé et anonyme.
              </p>
            </div>

            {/* Info Élection */}
            <div className="card" style={{ marginBottom: 24, background: '#f8f9fa', border: '1px solid #cccccc', borderRadius: '8px', padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ margin: 0, color: '#000000', fontSize: '20px' }}>{data.election?.nom}</h2>
                <span className="badge badge-success" style={{ background: '#e6f4ea', width : '78px' ,color: '#137333', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}> En cours</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="stat-card" style={{ background: '#ffffff', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '6px' }}>
                  <div className="stat-label" style={{ color: '#666666', fontSize: '12px', fontWeight: '600' }}>Clôture</div>
                  <div className="stat-value" style={{ fontSize: 16, color: '#000000', fontWeight: 'bold', marginTop: 4 }}>{data.election?.dateFin}</div>
                </div>
                <div className="stat-card" style={{ background: '#ffffff', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '6px' }}>
                  <div className="stat-label" style={{ color: '#666666', fontSize: '12px', fontWeight: '600' }}>Statut de votre vote</div>
                  <div className="stat-value" style={{ fontSize: 14, marginTop: 4, fontWeight: 'bold' }}>
                    {data.aVote ? (
                      <span style={{ color: '#137333' }}>✓ Vote enregistré</span>
                    ) : (
                      <span style={{ color: '#ff3333' }}>Vous n'avez pas encore voté</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Voter */}
            {!data.aVote ? (
              <div className="card" style={{ background: '#ffffff', border: '1px solid #cccccc', borderRadius: '8px', padding: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* CHANGEMENT ICI : Émoji urne remplacé par IconUrn SVG */}
                  <div style={{ flexShrink: 0, marginTop: 4 }}><IconUrn /></div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', color: '#000000' }}>Participer au vote</h2>
                    <p style={{ color: '#555555', marginBottom: 20, fontSize: 14 }}>
                      Votre vote sera chiffré avec RSA-2048 et AES-256 avant d'être envoyé.
                      Personne ne pourra lire votre choix, pas même l'administrateur.
                    </p>
                    <div className="alert alert-info" style={{ marginBottom: 20, background: '#e8f0fe', border: '1px solid #1a73e8', borderRadius: '6px', padding: '12px', color: '#1c3d5a', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>ℹ️</span>
                      <span style={{ fontSize: '13px' }}>Ce choix est définitif. Vous ne pourrez pas modifier votre vote.</span>
                    </div>
                <button
                className="btn btn-primary"
                style={{ maxWidth: 280, width: '100%', padding: '12px', borderRadius: '6px', fontWeight: '600', fontSize: 18, backgroundColor: '#34a853', border: 'none', color: '#ffffff' }}
                onClick={() => navigate('/voter/candidats')}
              >
                Accéder au vote →
              </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ background: '#ffffff', border: '1px solid #cccccc', borderRadius: '8px', padding: '20px' }}>
                <div className="alert alert-success" style={{ marginBottom: 0, background: '#e6f4ea', border: '1px solid #34a853', borderRadius: '6px', padding: '14px', color: '#137333', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left' }}>
                  {/* CHANGEMENT ICI : Émoji coché remplacé par IconCheck SVG */}
                  <IconCheck />
                  <span>Votre vote a été enregistré avec succès. Merci pour votre participation !</span>
                </div>
              </div>
            )}

            {/* Section Garanties (Bas) */}
            <div style={{ marginTop: 32, padding: '20px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #dddddd', textAlign: 'left' }}>
              <h3 style={{ marginBottom: 16, color: '#000000', fontSize: '15px', fontWeight: '600' }}>Garanties de sécurité</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                {[
                  [<IconLock />, 'Confidentialité', 'AES-256 + RSA-2048'],
                  [<IconShield />, 'Intégrité', 'Hash SHA-256'],
                  [<IconMask />, 'Anonymat', 'Vote non lié à l\'identité'],
                  [<IconPen />, 'Authenticité', 'Signature numérique'],
                ].map(([icon, title, sub]) => (
                  <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {/* CHANGEMENT ICI : Émojis de la liste remplacés par les composants d'icônes SVG */}
                    <span style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#333333' }}>{title}</div>
                      <div style={{ fontSize: 12, color: '#0066cc', fontFamily: 'monospace', marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}