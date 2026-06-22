import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
  faSpinner,
  faTriangleExclamation,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';   // ← ajouté ici

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loginAdmin } = useAuth();                    // ← déplacé ici, dans le composant

  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [isWarning, setIsWarning] = useState(false);

  // Reçoit le message de PrivateRoute
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      setIsWarning(true);
    }
  }, [location.state]);
const handleSubmit = async () => {
  if (!form.username || !form.password) {
    setError('Veuillez remplir tous les champs');
    console.log("Erreur login :Veuillez remplir tous les champs");
    setIsWarning(false);
    return;
  }
  setError('');
  setIsWarning(false);
  setLoading(true);
  try {
    const res = await authAPI.login(form.username, form.password);
const token = res.data.token;   // ← extrait depuis la réponse
      loginAdmin(token);              // ← utilise le hook du composant
      navigate('/admin/dashboard');
  } catch (err) {
    setError(err.response?.data?.error || 'Identifiants incorrects');
    console.log("Erreur login :Identifiants incorrects");
    setIsWarning(false);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  console.log("Login monté");
}, []);
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
            <FontAwesomeIcon
              icon={faShieldHalved}
              style={{ fontSize: '24px', color: '#072F75' }}
            />
          </div>
          <h1 style={{
            fontSize: '20px', fontWeight: '600',
            color: '#072F75', margin: '0 0 4px'
          }}>
            VoteSecure
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8caa', margin: 0 }}>
            Espace Administration
          </p>
        </div>

        {/* Notification */}
        {error && (
          <div style={{
            background: isWarning ? '#fff7ed' : '#fef2f2',
            border: `0.5px solid ${isWarning ? '#fb923c' : '#fca5a5'}`,
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: isWarning ? '#9a3412' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FontAwesomeIcon
              icon={isWarning ? faTriangleExclamation : faCircleXmark}
            />
            {error}
          </div>
        )}

        {/* Formulaire */}
        <div>


          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '12px',
              fontWeight: '500', color: '#5a6a82', marginBottom: '6px'
            }}>
              Identifiant
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faUser} style={{
                position: 'absolute', left: '12px',
                top: '50%', transform: 'translateY(-50%)',
                color: '#9aabbc', fontSize: '14px'
              }}/>
              <input
                type="text"
                placeholder="Identifiant admin"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                required
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

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '12px',
              fontWeight: '500', color: '#5a6a82', marginBottom: '6px'
            }}>
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
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                required
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
    <FontAwesomeIcon
      icon={loading ? faSpinner : faRightToBracket}
      spin={loading}
    />
    {loading ? 'Connexion...' : 'Se connecter'}
  </button>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '11px', color: '#9aabbc'
        }}>
          Élection Étudiante 2026 — VoteSecure
        </p>
      </div>
    </div>
  );
}