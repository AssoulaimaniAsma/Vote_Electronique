import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved, faIdCard, faLock, faEye, faEyeSlash,
  faRightToBracket, faSpinner, faTriangleExclamation, faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { voterAuthAPI } from '../../services/api';

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [cin, setCin]             = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      setIsWarning(true);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!cin.trim() || !password) {
      setError('Veuillez remplir tous les champs.');
      setIsWarning(false);
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setIsWarning(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await voterAuthAPI.login(cin.trim(), password);
      const { token, user } = res.data;
      login(token, user);
      if (user.aVote) {
        navigate('/voter/success', { replace: true });
      } else {
        navigate('/voter/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiant ou mot de passe incorrect.');
      setIsWarning(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f7fc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(7,47,117,0.10)',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '400px',
        border: '0.5px solid #c8d4ea'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: '#e8eef8', borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '14px'
          }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '24px', color: '#072F75' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#072F75', margin: '0 0 4px' }}>
            VoteSecure
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8caa', margin: 0 }}>
            Espace Électeur
          </p>
        </div>

        {/* Notification erreur */}
        {error && (
          <div style={{
            background: isWarning ? '#fff7ed' : '#fef2f2',
            border: `0.5px solid ${isWarning ? '#fb923c' : '#fca5a5'}`,
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: isWarning ? '#9a3412' : '#dc2626',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <FontAwesomeIcon icon={isWarning ? faTriangleExclamation : faCircleXmark} />
            {error}
          </div>
        )}

        {/* Champ CIN */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            CIN / Identifiant
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faIdCard} style={{
              position: 'absolute', left: '12px',
              top: '50%', transform: 'translateY(-50%)',
              color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type="text"
              placeholder="Ex: AB123456"
              value={cin}
              onChange={e => setCin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45',
                background: '#f4f7fc', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Champ Mot de passe */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faLock} style={{
              position: 'absolute', left: '12px',
              top: '50%', transform: 'translateY(-50%)',
              color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 36px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45',
                background: '#f4f7fc', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '12px',
                top: '50%', transform: 'translateY(-50%)',
                color: '#9aabbc', fontSize: '14px', cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Bouton */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '11px',
            background: loading ? '#5b7bbf' : '#072F75',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          <FontAwesomeIcon icon={loading ? faSpinner : faRightToBracket} spin={loading} />
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/* Lien inscription */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '13px', color: '#7a8caa' }}>Pas encore inscrit ? </span>
          <a
            onClick={() => navigate('/voter/register')}
            style={{ fontSize: '13px', color: '#072F75', fontWeight: '500', cursor: 'pointer' }}
          >
            S'inscrire
          </a>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#9aabbc' }}>
          Élection Étudiante 2026 — VoteSecure
        </p>
      </div>
    </div>
  );
}