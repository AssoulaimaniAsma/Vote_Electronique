import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { voterAuthAPI } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

const STEPS = [
  { label: 'Tableau de bord' },
  { label: 'Candidats'       },
  { label: 'Confirmation'    },
  { label: 'Vote enregistré' },
];

export default function NavHeader({ currentStep }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = async () => {
    try { await voterAuthAPI.logout(); } catch {}
    logout();
    navigate('/voter/login', { replace: true });
  };

  return (
    <header style={{
      background: '#072F75',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 28px', height: 58, width: '100%', boxSizing: 'border-box',
      fontFamily: 'Segoe UI, sans-serif'
    }}>

      {/* Logo — identique à l'admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 8, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16
        }}>
          <i className="ti ti-shield-check" aria-hidden="true" />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
          VoteSecure
        </span>
      </div>

      {/* Timeline */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((step, i) => {
          const stepNum  = i + 1;
          const isDone   = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{
                  width: 28, height: 1,
                  background: isDone || isActive
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.2)',
                  margin: '0 4px'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {/* Bulle */}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? '#fff'
                    : isDone
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.12)',
                  border: isActive ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                  flexShrink: 0
                }}>
                  {isDone
                    ? <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 13, color: '#fff' }} />
                    : <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: isActive ? '#072F75' : 'rgba(255,255,255,0.6)'
                      }}>{stepNum}</span>
                  }
                </div>
                {/* Label */}
                <span style={{
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? '#fff'
                    : isDone
                      ? 'rgba(255,255,255,0.75)'
                      : 'rgba(255,255,255,0.45)',
                }}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bouton déconnexion */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.8)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          borderRadius: 7, padding: '6px 12px',
          fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
        }}>
        <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: 12 }} />
        Déconnexion
      </button>
    </header>
  );
}