import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../../components/NavHeader';
import { useAuth } from '../../context/AuthContext';
import { voterAPI } from '../../services/api';

/* --- ICÔNES NETTOYÉES : PLUS AUCUN CARRÉ OU CONTOUR DE BOÎTE --- */
const IconTransport = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ background: 'transparent' }}>
    {/* On garde uniquement les lignes du bus/train sans le rectangle extérieur */}
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2"></path>
    <circle cx="7" cy="18" r="2"></circle>
    <circle cx="17" cy="18" r="2"></circle>
  </svg>
);

const IconLogement = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ background: 'transparent' }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconSante = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ background: 'transparent' }}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const IconEmploi = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ background: 'transparent' }}>
    {/* Suppression du <rect> extérieur : on ne dessine que la poignée et les lignes de la mallette */}
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    <path d="M2 7h20v14H2z"></path>
  </svg>
);

const ICONS = [<IconTransport />, <IconLogement />, <IconSante />, <IconEmploi />];
/* ------------------------------------------------------------------ */

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
voterAPI.getCandidates()
      .then(res => setCandidates(res.data))
      .catch(() => setError('Impossible de charger les candidats.'))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    if (!selected) return;
    sessionStorage.setItem('vs_selected_candidate', JSON.stringify(selected));
    navigate('/voter/confirm');
  };

  return (
    <div className="page-inner" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Barre de navigation bleue sur toute la largeur */}
      <div style={{ width: '100%', backgroundColor: '#0066cc', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '1440px' }}>
          <NavHeader currentStep={2} />
        </div>
      </div>

      {/* Conteneur du formulaire descendu avec marginTop: '90px' */}
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
          marginTop: '90px',
          width: '90%',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#000000', margin: 0 }}>Problèmes étudiants 2026 </h1>
          <p style={{ color: '#555555', marginTop: 8, fontSize: 15 }}>
            Quel est votre problème prioritaire ? Vous ne pourrez voter qu'une seule fois !
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ color: '#ff3333', marginBottom: 20 }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555555' }}>
            <div className="spinner" style={{ margin: '0 auto', borderTopColor: '#0066cc' }} />
            <div style={{ marginTop: 16 }}>Chargement des candidats...</div>
          </div>
        ) : (
          <>
            <div className="candidate-list" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {candidates.map((c, i) => {
                const isCardSelected = selected?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`candidate-card ${isCardSelected ? 'selected' : ''}`}
                    onClick={() => setSelected(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isCardSelected ? '2px solid #34a853' : '1px solid #cccccc',
                      backgroundColor: isCardSelected ? '#f1f9f3' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: 16
                    }}
                  >
                    {/* Bouton radio */}
                    <div className="candidate-radio" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', border: isCardSelected ? '2px solid #34a853' : '2px solid #aaaaaa', background: '#ffffff' }}>
                      {isCardSelected && <div className="candidate-radio-dot" style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#34a853' }} />}
                    </div>

                    {/* Conteneur d'avatar totalement transparent sans carré de fond */}
                    <div className="candidate-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'transparent', backgroundColor: 'transparent' }}>
                      {ICONS[i % ICONS.length]}
                    </div>

                    <div className="candidate-info" style={{ flex: 1 }}>
                      <div className="candidate-name" style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>{c.nom}</div>
                      <div className="candidate-desc" style={{ color: '#555555', fontSize: 14, marginTop: 4 }}>{c.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boutons Retour et Suivant */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                className="btn btn-secondary"
                style={{ maxWidth: 140, width: '100%', padding: '12px', borderRadius: '6px', fontSize: 16, cursor: 'pointer' }}
                onClick={() => navigate('/voter/dashboard')}
              >
                ← Retour
              </button>
              
              <button
                className="btn btn-primary"
                disabled={!selected}
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: 16,
                  fontWeight: '600',
                  cursor: selected ? 'pointer' : 'not-allowed',
                  backgroundColor: selected ? '#34a853' : '#cccccc',
                  color: '#ffffff',
                  border: 'none',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Suivant →
              </button>
            </div>

            {selected && (
              <div className="alert alert-info" style={{ marginTop: 20, background: '#e8f0fe', border: '1px solid #1a73e8', borderRadius: '6px', padding: '12px', color: '#1c3d5a', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>✓</span>
                <span style={{ fontSize: '14px' }}>Vous avez sélectionné : <strong>{selected.nom}</strong></span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}