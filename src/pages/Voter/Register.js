import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved, faIdCard, faEnvelope, faLock, faEye, faEyeSlash,
  faUserPlus, faSpinner, faTriangleExclamation, faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import { voterAuthAPI } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cin: '', nom: '', prenom: '', email: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const update = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError('');

    if (!form.cin.trim() || !form.nom.trim() || !form.prenom.trim() || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Adresse email invalide.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await voterAuthAPI.register({
        cin: form.cin.trim(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f4f7fc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div style={{
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(7,47,117,0.10)',
          padding: '44px 36px', width: '100%', maxWidth: '420px',
          border: '0.5px solid #c8d4ea', textAlign: 'center'
        }}>
          <div style={{
            width: '60px', height: '60px', background: '#E1F5EE',
            borderRadius: '50%', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '18px'
          }}>
            <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '26px', color: '#0F6E56' }} />
          </div>
          <h1 style={{ fontSize: '19px', fontWeight: '600', color: '#072F75', margin: '0 0 10px' }}>
            Inscription reçue
          </h1>
          <p style={{ fontSize: '13px', color: '#5a6a82', lineHeight: 1.6, marginBottom: '24px' }}>
            Votre compte est en attente de validation par l'administrateur.
            Vous pourrez vous connecter dès que votre inscription sera approuvée.
          </p>
          <button
            onClick={() => navigate('/voter/login')}
            style={{
              width: '100%', padding: '11px', background: '#072F75',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '500', cursor: 'pointer'
            }}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f4f7fc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', padding: '24px 0'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(7,47,117,0.10)',
        padding: '40px 36px', width: '100%', maxWidth: '420px',
        border: '0.5px solid #c8d4ea'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', background: '#e8eef8',
            borderRadius: '50%', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
          }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '24px', color: '#072F75' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#072F75', margin: '0 0 4px' }}>
            VoteSecure
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8caa', margin: 0 }}>
            Inscription électeur
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '0.5px solid #fca5a5',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
            fontSize: '13px', color: '#dc2626',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {error}
          </div>
        )}

        {/* CIN */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            CIN
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faIdCard} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type="text" placeholder="Ex: AB123456"
              value={form.cin} onChange={update('cin')}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45', background: '#f4f7fc',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Nom + Prénom */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
              Nom
            </label>
            <input
              type="text" placeholder="Nom" value={form.nom} onChange={update('nom')}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 12px', border: '0.5px solid #c8d4ea',
                borderRadius: '8px', fontSize: '13px', color: '#1a2a45',
                background: '#f4f7fc', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
              Prénom
            </label>
            <input
              type="text" placeholder="Prénom" value={form.prenom} onChange={update('prenom')}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 12px', border: '0.5px solid #c8d4ea',
                borderRadius: '8px', fontSize: '13px', color: '#1a2a45',
                background: '#f4f7fc', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faEnvelope} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type="email" placeholder="email@exemple.com"
              value={form.email} onChange={update('email')}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45', background: '#f4f7fc',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faLock} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type={showPass ? 'text' : 'password'} placeholder="••••••••"
              value={form.password} onChange={update('password')}
              disabled={loading}
              style={{
                width: '100%', padding: '10px 36px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45', background: '#f4f7fc',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#9aabbc',
                fontSize: '14px', cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Confirm password */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#5a6a82', marginBottom: '6px' }}>
            Confirmer le mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faLock} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: '#9aabbc', fontSize: '14px'
            }}/>
            <input
              type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
              value={form.confirmPassword} onChange={update('confirmPassword')}
              disabled={loading}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '10px 36px 10px 36px',
                border: '0.5px solid #c8d4ea', borderRadius: '8px',
                fontSize: '13px', color: '#1a2a45', background: '#f4f7fc',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            <FontAwesomeIcon
              icon={showConfirm ? faEyeSlash : faEye}
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#9aabbc',
                fontSize: '14px', cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <button
          type="button" onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', padding: '11px',
            background: loading ? '#5b7bbf' : '#072F75',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px'
          }}>
          <FontAwesomeIcon icon={loading ? faSpinner : faUserPlus} spin={loading} />
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '13px', color: '#7a8caa' }}>Déjà inscrit ? </span>
          <a
            onClick={() => navigate('/voter/login')}
            style={{ fontSize: '13px', color: '#072F75', fontWeight: '500', cursor: 'pointer' }}>
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}