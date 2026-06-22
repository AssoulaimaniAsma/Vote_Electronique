import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { voterAPI, voterAuthAPI } from '../../services/api';
import NavHeader from '../../components/NavHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faLock, faKey, faSignature,
  faHashtag, faDatabase, faChartBar, faRightFromBracket,
  faArrowRight, faLockOpen, faSpinner
} from '@fortawesome/free-solid-svg-icons';

const PRIMARY = '#072F75';

const SECURITY_ITEMS = [
  { icon: faLock,      label: 'Vote chiffré',       value: 'AES-256-GCM'                  },
  { icon: faKey,       label: 'Clé protégée',        value: 'RSA-2048 (clé commission)'    },
  { icon: faSignature, label: 'Signature numérique', value: "Clé privée RSA de l'électeur" },
  { icon: faHashtag,   label: "Hash d'intégrité",    value: 'SHA-256'                      },
  { icon: faDatabase,  label: 'Stockage',            value: 'Jamais en clair en base'      },
];

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
    <div style={{ minHeight: '100vh', background: '#f4f7fc', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif' }}>

      <div style={{ width: '100%' }}>
        <NavHeader currentStep={4} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* Header succès */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, background: '#E1F5EE', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 30, color: '#0F6E56' }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Vote enregistré !
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
              Votre vote a été chiffré, signé numériquement et enregistré de manière sécurisée.
            </p>
          </div>

          {/* Candidat voté */}
          {votedCandidate && (
            <div style={{ background: '#EFF6FF', border: '0.5px solid #BFDBFE', borderRadius: 12, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: 6 }}>
                Votre choix
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: PRIMARY }}>
                {votedCandidate.nom}
              </div>
            </div>
          )}

          {/* Référence */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: 10 }}>
              Référence unique de votre vote
            </div>
            <div style={{
              background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 8,
              padding: '10px 14px', fontFamily: 'monospace', fontSize: 15,
              fontWeight: 700, color: PRIMARY, textAlign: 'center', letterSpacing: '0.05em'
            }}>
              {reference}
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '10px 0 0', lineHeight: 1.5 }}>
              Conservez cette référence. Elle vous permet de vérifier que votre vote a été pris en compte.
            </p>
          </div>

          {/* Remerciement */}
          <div style={{ background: '#E1F5EE', border: '0.5px solid #6EE7B7', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#0F6E56', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 16, flexShrink: 0 }} />
            Merci pour votre participation, <strong>{user?.prenom}</strong> ! Votre voix compte.
          </div>

          {/* Récapitulatif sécurité */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: 14 }}>
              Récapitulatif de sécurité
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {SECURITY_ITEMS.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, background: '#EFF6FF', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FontAwesomeIcon icon={item.icon} style={{ fontSize: 12, color: PRIMARY }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label} : </span>
                    <span style={{ fontSize: 12, color: PRIMARY, fontFamily: 'monospace', fontWeight: 600 }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton résultats */}
          {statutLoading ? (
            <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px', marginBottom: 16, textAlign: 'center' }}>
              <FontAwesomeIcon icon={faSpinner} spin style={{ color: '#9CA3AF', fontSize: 16 }} />
            </div>
          ) : resultatsDisponibles ? (
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faChartBar} style={{ fontSize: 15, color: PRIMARY }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Résultats disponibles</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>L'élection a été dépouillée.</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/voter/resultats')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: PRIMARY, color: '#fff', border: 'none',
                  borderRadius: 8, padding: '10px', fontSize: 13,
                  fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
                }}>
                <FontAwesomeIcon icon={faChartBar} style={{ fontSize: 12 }} />
                Voir les résultats officiels
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
              </button>
            </div>
          ) : (
            <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: '#F1F5F9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faLockOpen} style={{ fontSize: 15, color: '#9CA3AF' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Résultats non disponibles</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                    Les résultats seront accessibles une fois l'élection dépouillée par l'administrateur.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#fff', color: '#374151', border: '0.5px solid #E2E8F0',
              borderRadius: 8, padding: '10px', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'
            }}>
            <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: 12 }} />
            Se déconnecter
          </button>

        </div>
      </div>
    </div>
  );
}