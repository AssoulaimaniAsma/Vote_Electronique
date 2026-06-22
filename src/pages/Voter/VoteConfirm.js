import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { voterAPI } from '../../services/api';
import NavHeader from '../../components/NavHeader';

export default function VoteConfirm() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { markVoted } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('vs_selected_candidate');
    if (!stored) {
      navigate('/voter/candidats', { replace: true });
      return;
    }
    setCandidate(JSON.parse(stored));
  }, [navigate]);

  const handleVote = async () => {
    if (!candidate) return;
    setLoading(true);
    setError('');

    try {
const res = await voterAPI.submitVote(candidate.id);
      const { reference } = res.data;

      // Marquer comme voté
      markVoted(reference);
      sessionStorage.removeItem('vs_selected_candidate');

      // Stocker la référence pour l'écran succès
      sessionStorage.setItem('vs_vote_reference', reference);

      navigate('/voter/success', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Une erreur est survenue lors du vote.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) return null;

  return (
    <div className="page-inner" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Barre de navigation bleue sur toute la largeur */}
      <div style={{ width: '100%', backgroundColor: '#0066cc', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '1440px' }}>
          <NavHeader currentStep={3} />
        </div>
      </div>

      {/* Conteneur principal blanc avec bordure noire comme sur la liste */}
      <div 
        className="main-content fade-in" 
        style={{ 
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          borderRadius: '12px',
          maxWidth: 720,
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
          <h1 style={{ color: '#000000', margin: 0, fontSize: 28 }}>Confirmer votre vote</h1>
          <p style={{ color: '#555555', marginTop: 8, fontSize: 15 }}>
            Vérifiez votre choix avant de valider. Cette action est irréversible.
          </p>
        </div>

        {/* Résumé du candidat sélectionné */}
        <div className="confirm-box" style={{ marginBottom: 20, padding: '16px', border: '1px solid #cccccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <div className="confirm-label" style={{ fontSize: 13, textTransform: 'uppercase', color: '#555555', fontWeight: 'bold', marginBottom: 4 }}>Votre choix</div>
          <div className="confirm-value" style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>{candidate.nom}</div>
          <div style={{ marginTop: 8, fontSize: 14, color: '#555555' }}>
            {candidate.description}
          </div>
        </div>

        {/* Alerte Attention */}
        <div className="alert alert-warning" style={{ marginBottom: 24, padding: '12px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '6px', color: '#856404', display: 'flex', gap: '8px', alignItems: 'center', fontSize: 14 }}>
          <span>⚠️</span>
          <span>Ce choix est <strong>définitif</strong> et ne peut pas être modifié une fois validé.</span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ color: '#ff3333', marginBottom: 20, padding: '12px', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '6px', fontSize: 14 }}>{error}</div>
        )}

        {/* Animation de chiffrement en cours de chargement */}
        {loading && (
          <div className="confirm-box" style={{ marginBottom: 24, padding: '20px', border: '1px solid #b8daff', borderRadius: '8px', backgroundColor: '#e2e3e5', textAlign: 'center' }}>
            <div className="encrypt-animation">
              <div className="encrypt-icon" style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#000000' }}>Chiffrement en cours...</div>
                <div style={{ fontSize: 13, color: '#555555', marginBottom: 12 }}>
                  Hash SHA-256 · Signature numérique · AES-256 · RSA-2048
                </div>
              </div>
              <div className="encrypt-dots" style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                <div className="encrypt-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0066cc' }} />
                <div className="encrypt-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0066cc' }} />
                <div className="encrypt-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0066cc' }} />
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'actions */}
        {!loading && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-secondary"
              style={{ maxWidth: 140, width: '100%', padding: '12px', borderRadius: '6px', fontSize: 16, cursor: 'pointer' }}
              onClick={() => navigate('/vote/candidats')}
            >
              ← Retour
            </button>
            
            {/* CHANGEMENT ICI : Bouton vert professionnel sans émoji */}
            <button
              className="btn btn-primary"
              onClick={handleVote}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: 16,
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: '#34a853', // Fond vert
                color: '#ffffff',
                border: 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              Confirmer mon vote
            </button>
          </div>
        )}

        {/* Informations techniques simplifiées sur le flux */}
        <div style={{ marginTop: 28, padding: '14px 16px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #cccccc' }}>
          <div style={{ fontSize: 11, color: '#555555', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Flux cryptographique sécurisé
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              'Hash SHA-256',
              '→',
              'Signature RSA',
              '→',
              'Chiffrement AES-256',
              '→',
              'Clé chiffrée RSA',
              '→',
              'Stockage',
            ].map((s, i) => (
              <span key={i} style={{
                fontSize: 12,
                color: s === '→' ? '#777777' : '#0066cc',
                background: s === '→' ? 'transparent' : '#e6f0fa',
                padding: s === '→' ? '0' : '4px 8px',
                borderRadius: 4,
                fontFamily: s !== '→' ? 'monospace' : 'inherit',
                fontWeight: s !== '→' ? '600' : 'normal'
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}