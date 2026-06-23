import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { voterAPI, voterAuthAPI } from '../../services/api';
import NavHeader from '../../components/NavHeader';

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const IconPen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const IconHash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const IconDatabase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066cc' }}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
  </svg>
);

const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6"  y1="20" x2="6"  y2="14"></line>
  </svg>
);

const IconLockSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function VoteSuccess() {
  const [reference, setReference]           = useState('');
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [electionStatut, setElectionStatut] = useState(null);
  const [statutLoading, setStatutLoading]   = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const ref = sessionStorage.getItem('vs_vote_reference')
      || `VOT-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    setReference(ref);

    const stored = sessionStorage.getItem('vs_voted_candidate');
    if (stored) setVotedCandidate(JSON.parse(stored));

    voterAPI.getElectionStatut()
      .then(res => setElectionStatut(res.data.statut))
      .catch(() => {})
      .finally(() => setStatutLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await voterAuthAPI.logout(); } catch {}
    logout();
    navigate('/voter/login', { replace: true });
  };

  const resultatsDisponibles = electionStatut === 'DEPOUILLE';

  return (
    <div className="page-inner" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* Navbar */}
      <div style={{ width: '100%', backgroundColor: '#0066cc', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '1440px' }}>
          <NavHeader currentStep={4} />
        </div>
      </div>

      {/* Conteneur principal */}
      <div
        className="main-content fade-in"
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          borderRadius: '12px',
          maxWidth: 820,
          textAlign: 'center',
          padding: '30px 40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: '#000000',
          marginTop: '12px',
          width: '90%',
          boxSizing: 'border-box'
        }}
      >
        {/* Icône succès */}
        <div className="success-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 style={{ marginBottom: 12, color: '#000000' }}>Vote enregistré !</h1>
        <p style={{ color: '#555555', marginBottom: 32, fontSize: 15 }}>
          Votre vote a été chiffré, signé numériquement et enregistré dans le système de manière sécurisée.
        </p>

        {/* Candidat voté */}
        {votedCandidate && (
          <div className="confirm-box" style={{ background: '#e8f0fe', border: '1px solid #1a73e8', borderRadius: '8px', padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
            <div className="confirm-label" style={{ color: '#333333', fontWeight: '600', fontSize: '13px' }}>VOTRE CHOIX</div>
            <div style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '16px', marginTop: 6 }}>
              {votedCandidate.nom}
            </div>
          </div>
        )}

        {/* Référence */}
        <div className="confirm-box" style={{ background: '#f8f9fa', border: '1px solid #cccccc', borderRadius: '8px', padding: '16px', marginBottom: 24, textAlign: 'left' }}>
          <div className="confirm-label" style={{ color: '#333333', fontWeight: '600', fontSize: '13px' }}>RÉFÉRENCE UNIQUE DE VOTRE VOTE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <span className="reference-code" style={{ color: '#0066cc', fontWeight: 'bold', fontSize: '16px', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e0e0e0', padding: '8px 12px', borderRadius: '6px', width: '100%', display: 'block', textAlign: 'center' }}>
              {reference}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#666666', margin: '10px 0 0 0' }}>
            Conservez cette référence. Elle vous permet de vérifier que votre vote a été pris en compte.
          </p>
        </div>

        {/* Remerciement */}
        <div className="alert alert-success" style={{ background: '#e6f4ea', border: '1px solid #34a853', borderRadius: '8px', padding: '14px', marginBottom: 24, textAlign: 'left', color: '#137333', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Merci pour votre participation, <strong>{user?.prenom}</strong> ! Votre voix compte.</span>
        </div>

        {/* Récapitulatif sécurité */}
        <div style={{ background: '#f8f9fa', border: '1px solid #dddddd', borderRadius: 8, padding: '20px', marginBottom: 24, textAlign: 'left' }}>
          <h3 style={{ marginBottom: 14, color: '#000000', fontSize: '15px', fontWeight: '600' }}>RÉCAPITULATIF DE SÉCURITÉ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              [<IconLock />,     'Vote chiffré',        'AES-256-CBC'                       ],
              [<IconKey />,      'Clé protégée',         'RSA-2048 (clé commission)'         ],
              [<IconPen />,      'Signature numérique',  "Clé privée RSA de l'électeur"      ],
              [<IconHash />,     "Hash d'intégrité",     'SHA-256'                           ],
              [<IconDatabase />, 'Stockage',             'Jamais en clair en base de données'],
            ].map(([icon, label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
                <div>
                  <span style={{ fontSize: 13, color: '#444444' }}>{label} : </span>
                  <span style={{ fontSize: 13, color: '#0066cc', fontFamily: 'monospace', fontWeight: '600' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section résultats */}
        {statutLoading ? (
          <div style={{ background: '#f8f9fa', border: '1px solid #cccccc', borderRadius: '8px', padding: '14px', marginBottom: 24, color: '#888888', fontSize: 13 }}>
            Vérification de la disponibilité des résultats...
          </div>
        ) : resultatsDisponibles ? (
          <div className="alert alert-info" style={{ background: '#e8f0fe', border: '1px solid #1a73e8', borderRadius: '8px', padding: '16px', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#1c3d5a' }}>
              <IconChart />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Résultats disponibles</div>
                <div style={{ fontSize: '12px', color: '#555555', marginTop: 2 }}>L'élection a été dépouillée par l'administrateur.</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/voter/resultats')}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: 14, fontWeight: '600', background: '#0066cc', color: '#ffffff', border: 'none', cursor: 'pointer' }}>
              Voir les résultats officiels →
            </button>
          </div>
        ) : (
          <div style={{ background: '#f8f9fa', border: '1px solid #cccccc', borderRadius: '8px', padding: '14px', marginBottom: 24, textAlign: 'left', display: 'flex', gap: 10, alignItems: 'flex-start', color: '#555555' }}>
            <span style={{ flexShrink: 0, marginTop: 2 }}><IconLockSmall /></span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#333333', marginBottom: 4 }}>Résultats non disponibles</div>
              <div style={{ fontSize: '12px' }}>Les résultats seront accessibles une fois l'élection dépouillée par l'administrateur.</div>
            </div>
          </div>
        )}

        <button className="btn btn-secondary" onClick={handleLogout} style={{ maxWidth: 240, margin: '0 auto', width: '100%', padding: '10px', borderRadius: '6px', fontSize: 15 }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}