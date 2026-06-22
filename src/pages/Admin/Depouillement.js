import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLockOpen, faPlay, faCheckCircle,
  faTriangleExclamation, faTrophy, faMedal
} from '@fortawesome/free-solid-svg-icons';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const PRIMARY = '#072F75';
const COLORS  = ['#072F75', '#378ADD', '#85B7EB', '#B5D4F4', '#5B9BF0', '#0C447C'];

export default function Depouillement() {
  const [phase, setPhase]         = useState('loading_init');
  const [resultats, setResultats] = useState([]);
  const [errorMsg, setErrorMsg]   = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [election, setElection]   = useState(null);

  // Au chargement — vérifie si déjà dépouillé
  useEffect(() => {
    const init = async () => {
      try {
        const res = await adminAPI.getElection();
        setElection(res.data);
        if (res.data?.statut === 'DEPOUILLE') {
          // Récupère les résultats existants
          const depRes = await adminAPI.getResultats();
          setResultats(Array.isArray(depRes.data) ? depRes.data : []);
          setPhase('done');
        } else if (res.data?.statut === 'EN_COURS') {
          // Élection pas encore terminée — pas autorisé
          setPhase('not_ready');
        } else {
          // TERMINEE — prêt à dépouiller
          setPhase('idle');
        }
      } catch (e) {
        setPhase('idle');
      }
    };
    init();
  }, []);

  const totalVoix = resultats.reduce((s, r) => s + (r.voix || 0), 0);
  const sorted    = [...resultats].sort((a, b) => (b.voix || 0) - (a.voix || 0));

  const getRankIcon = (i) => {
    if (i === 0) return <FontAwesomeIcon icon={faTrophy} style={{ color: '#F59E0B', fontSize: 16 }} />;
    if (i === 1) return <FontAwesomeIcon icon={faMedal}  style={{ color: '#9CA3AF', fontSize: 15 }} />;
    if (i === 2) return <FontAwesomeIcon icon={faMedal}  style={{ color: '#CD7C2F', fontSize: 15 }} />;
    return <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{i + 1}</span>;
  };

  const handleLancer = async () => {
    setPhase('loading'); setErrorMsg('');
    try {
      const res  = await adminAPI.depouillement();
      const data = Array.isArray(res.data) ? res.data : [];
      setResultats(data);
      setPhase('done');
    } catch (e) {
      setErrorMsg(e.response?.data?.error || 'Erreur lors du dépouillement.');
      setPhase('error');
    }
  };

  return (
    <AdminLayout>

      {/* Topbar */}
      <div style={{ height: 54, background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', flex: 1 }}>Dépouillement des votes</div>
        {phase === 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0F6E56', background: '#E1F5EE', padding: '5px 12px', borderRadius: 6, fontWeight: 500 }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 12 }} />
            Terminé — {totalVoix} votes traités
          </div>
        )}
      </div>

      <div style={{ padding: '24px 28px', flex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>Administration</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', marginBottom: 22 }}>Dépouillement</div>

        {/* ── INIT LOADING ── */}
        {phase === 'loading_init' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 13 }}>
            Chargement...
          </div>
        )}

        {/* ── PAS PRÊT ── */}
        {phase === 'not_ready' && (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <FontAwesomeIcon icon={faLockOpen} style={{ fontSize: 36, color: '#F59E0B', marginBottom: 16 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>
                Élection en cours
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                Vous devez d'abord terminer l'élection depuis
                <strong> Gestion → Paramètres</strong> avant de lancer le dépouillement.
              </div>
            </div>
          </div>
        )}

        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 72, height: 72, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <FontAwesomeIcon icon={faLockOpen} style={{ fontSize: 30, color: PRIMARY }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '0 0 10px' }}>
                Lancer le dépouillement
              </h2>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
                Cette action déchiffre tous les votes, vérifie les signatures numériques et comptabilise les résultats.
                Elle est <strong>irréversible</strong>.
              </p>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
                {['Déchiffrement RSA', '→', 'Déchiffrement AES', '→', 'Vérification signature', '→', 'Comptabilisation'].map((s, i) => (
                  <span key={i} style={{
                    fontSize: 11, color: s === '→' ? '#9CA3AF' : PRIMARY,
                    background: s === '→' ? 'transparent' : '#EFF6FF',
                    padding: s === '→' ? '0 2px' : '4px 8px',
                    borderRadius: 4, fontFamily: s !== '→' ? 'monospace' : 'inherit',
                    fontWeight: s !== '→' ? 600 : 'normal'
                  }}>{s}</span>
                ))}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontSize: 13, color: '#374151', cursor: 'pointer', marginBottom: 24 }}>
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: PRIMARY }} />
                Je confirme vouloir lancer le dépouillement définitif
              </label>

              <button onClick={handleLancer} disabled={!confirmed}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: confirmed ? PRIMARY : '#E2E8F0',
                  color: confirmed ? '#fff' : '#9CA3AF',
                  border: 'none', borderRadius: 10, padding: '12px 28px',
                  fontSize: 14, fontWeight: 500,
                  cursor: confirmed ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', transition: 'all 0.2s'
                }}>
                <FontAwesomeIcon icon={faPlay} style={{ fontSize: 13 }} />
                Lancer le dépouillement
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === 'loading' && (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 56, height: 56, border: `3px solid #EFF6FF`, borderTop: `3px solid ${PRIMARY}`, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: '#0f172a', marginBottom: 8 }}>Dépouillement en cours...</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Déchiffrement RSA + AES · Vérification des signatures</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: 36, color: '#DC2626', marginBottom: 16 }} />
              <div style={{ fontSize: 15, fontWeight: 500, color: '#DC2626', marginBottom: 8 }}>Erreur lors du dépouillement</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>{errorMsg}</div>
              <button onClick={() => { setPhase('idle'); setConfirmed(false); }}
                style={{ background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Total votes traités', val: totalVoix,             color: '#EFF6FF', tc: PRIMARY   },
                { label: 'Candidats en lice',   val: sorted.length,         color: '#E1F5EE', tc: '#0F6E56' },
                { label: 'Vainqueur',            val: sorted[0]?.candidat ?? sorted[0]?.nom ?? '—', color: '#FFF7E6', tc: '#854F0B' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, border: '0.5px solid #E2E8F0', borderRadius: 14, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: s.label === 'Vainqueur' ? 16 : 24, fontWeight: 600, color: s.tc, lineHeight: 1.2 }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>Résultats détaillés</div>
              {sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 13 }}>Aucun vote enregistré.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {sorted.map((r, i) => {
                    const pct   = totalVoix > 0 ? ((r.voix || 0) / totalVoix * 100).toFixed(1) : '0.0';
                    const color = COLORS[i % COLORS.length];
                    return (
                      <div key={r.candidat_id || i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getRankIcon(i)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                                {r.candidat ?? r.nom ?? `Candidat ${r.candidat_id}`}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 13, color: '#6B7280' }}>{r.voix ?? 0} voix</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color, background: `${color}18`, padding: '2px 8px', borderRadius: 5, minWidth: 50, textAlign: 'center' }}>
                                  {pct}%
                                </span>
                              </div>
                            </div>
                            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
                              <div style={{ height: 8, borderRadius: 100, background: color, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                            </div>
                          </div>
                        </div>
                        {i < sorted.length - 1 && <div style={{ height: '0.5px', background: '#F1F5F9', margin: '4px 0 4px 40px' }} />}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                <span>Total</span>
                <span>{totalVoix} voix exprimées</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}