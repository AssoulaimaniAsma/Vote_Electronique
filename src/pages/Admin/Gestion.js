import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserPlus, faTrash, faMagnifyingGlass,
  faCircleCheck, faClock, faPlus, faPen,
  faCog, faStopCircle, faCheckCircle, faLockOpen, faXmark,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import { useNavigate } from 'react-router-dom';

const PRIMARY = '#072F75';

export default function Gestion() {
  const navigate = useNavigate();
  const [tab, setTab]             = useState('candidats');
  const [candidats, setCandidats] = useState([]);
  const [electeurs, setElecteurs] = useState([]);
  const [election, setElection]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]       = useState('');
  const [terminating, setTerminating] = useState(false);

  const [showModal, setShowModal]   = useState(false);
  const [newNom, setNewNom]         = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [modalError, setModalError] = useState('');

  const [showElModal, setShowElModal] = useState(false);
  const [newEl, setNewEl]             = useState({ cin: '', nom: '', prenom: '', email: '' });
  const [savingEl, setSavingEl]       = useState(false);
  const [elError, setElError]         = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, eRes, elRes] = await Promise.all([
        adminAPI.getCandidats(),
        adminAPI.getElecteurs(),
        adminAPI.getElection(),
      ]);
      setCandidats(cRes.data);
      setElecteurs(eRes.data);
      setElection(elRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [cRes, eRes, elRes] = await Promise.all([
        adminAPI.getCandidats(),
        adminAPI.getElecteurs(),
        adminAPI.getElection(),
      ]);
      setCandidats(cRes.data);
      setElecteurs(eRes.data);
      setElection(elRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTerminerElection = async () => {
    if (!window.confirm("Terminer l'élection ? Les électeurs ne pourront plus voter après cette action.")) return;
    setTerminating(true);
    try {
      await adminAPI.terminerElection();
      await fetchAll();
    } catch (e) {
      alert(e.response?.data?.error || 'Erreur');
    } finally {
      setTerminating(false);
    }
  };

  const handleDeleteCandidat = async (id) => {
    if (!window.confirm('Supprimer ce candidat ?')) return;
    try {
      await adminAPI.deleteCandidat(id);
      setCandidats(prev => prev.filter(c => c.id !== id));
    } catch { alert('Erreur lors de la suppression'); }
  };

  const handleValiderElecteur = async (id) => {
    try {
      await adminAPI.validerElecteur(id);
      await fetchAll();
    } catch { alert('Erreur lors de la validation'); }
  };

  const handleRefuserElecteur = async (id) => {
    if (!window.confirm('Refuser cette inscription ?')) return;
    try {
      await adminAPI.refuserElecteur(id);
      await fetchAll();
    } catch { alert('Erreur lors du refus'); }
  };

  const handleAddCandidat = async () => {
    if (!newNom.trim()) { setModalError('Le nom est requis.'); return; }
    setSaving(true); setModalError('');
    try {
      await adminAPI.addCandidat({ nom: newNom.trim(), description: newDesc.trim() });
      await fetchAll();
      setShowModal(false); setNewNom(''); setNewDesc('');
    } catch { setModalError("Erreur lors de l'ajout."); }
    finally { setSaving(false); }
  };

  const handleAddElecteur = async () => {
    if (!newEl.cin.trim() || !newEl.nom.trim()) { setElError('CIN et nom requis.'); return; }
    setSavingEl(true); setElError('');
    try {
      await adminAPI.addElecteur(newEl);
      await fetchAll();
      setShowElModal(false); setNewEl({ cin: '', nom: '', prenom: '', email: '' });
    } catch { setElError("Erreur lors de l'ajout."); }
    finally { setSavingEl(false); }
  };

  const filteredCandidats = candidats.filter(c =>
    c.nom?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredElecteurs = electeurs.filter(e =>
    e.nom?.toLowerCase().includes(search.toLowerCase()) ||
    e.cin?.toLowerCase().includes(search.toLowerCase())
  );

  const votesCount = electeurs.filter(e => e.aVote).length;
  const totalEl    = electeurs.length;

  return (
    <AdminLayout>

      {/* Topbar */}
      <div style={{ height: 54, background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', flex: 1 }}>Gestion de l'élection</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>
          {candidats.length} candidats · {totalEl} électeurs · {votesCount} votes
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px', flex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 4 }}>Administration</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', marginBottom: 22 }}>Gestion</div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F1F5F9', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {[
            { key: 'candidats',  icon: faPen,   label: `Candidats (${candidats.length})` },
            { key: 'electeurs',  icon: faUsers,  label: `Électeurs (${totalEl})`          },
            { key: 'parametres', icon: faCog,    label: 'Paramètres'                      },
          ].map(t => (
            <button key={t.key}
              onClick={() => { setTab(t.key); setSearch(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 8, border: 'none',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                background: tab === t.key ? '#fff' : 'transparent',
                color: tab === t.key ? PRIMARY : '#6B7280',
                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
              <FontAwesomeIcon icon={t.icon} style={{ fontSize: 13 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Card principale */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: 14, padding: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {/* Barre outils — masquée pour Paramètres */}
          {tab !== 'parametres' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 13 }} />
                <input
                  type="text"
                  placeholder={tab === 'candidats' ? 'Rechercher un candidat...' : 'Rechercher par nom ou CIN...'}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ padding: '8px 12px 8px 32px', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#374151', background: '#F9FAFB', outline: 'none', width: 260, fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {tab === 'electeurs' && (
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    title="Actualiser la liste des électeurs"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      background: '#F9FAFB', color: '#374151',
                      border: '0.5px solid #E2E8F0', borderRadius: 8,
                      padding: '9px 14px', fontSize: 13, fontWeight: 500,
                      cursor: refreshing ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', opacity: refreshing ? 0.6 : 1
                    }}>
                    <FontAwesomeIcon
                      icon={faArrowsRotate}
                      spin={refreshing}
                      style={{ fontSize: 12 }}
                    />
                    Actualiser
                  </button>
                )}
                <button
                  onClick={() => tab === 'candidats' ? setShowModal(true) : setShowElModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: 12 }} />
                  {tab === 'candidats' ? 'Ajouter candidat' : 'Ajouter électeur'}
                </button>
              </div>
            </div>
          )}

          {/* ── TAB CANDIDATS ── */}
          {tab === 'candidats' && (
            loading
              ? <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 13 }}>Chargement...</div>
              : filteredCandidats.length === 0
                ? <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 13 }}>Aucun candidat trouvé.</div>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '0.5px solid #E2E8F0' }}>
                        {['#', 'Nom', 'Description', 'Action'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidats.map((c, i) => (
                        <tr key={c.id} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                          <td style={{ padding: '12px', fontSize: 13, color: '#9CA3AF' }}>{i + 1}</td>
                          <td style={{ padding: '12px', fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{c.nom}</td>
                          <td style={{ padding: '12px', fontSize: 12, color: '#6B7280', maxWidth: 300 }}>{c.description || '—'}</td>
                          <td style={{ padding: '12px' }}>
                            <button onClick={() => handleDeleteCandidat(c.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FEF2F2', color: '#DC2626', border: '0.5px solid #FECACA', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                              <FontAwesomeIcon icon={faTrash} style={{ fontSize: 11 }} />
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
          )}

          {/* ── TAB ÉLECTEURS ── */}
          {tab === 'electeurs' && (
            loading
              ? <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 13 }}>Chargement...</div>
              : (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Total inscrits', val: totalEl,            color: '#EFF6FF', tc: PRIMARY   },
                      { label: 'Ont voté',        val: votesCount,         color: '#E1F5EE', tc: '#0F6E56' },
                      { label: "N'ont pas voté",  val: totalEl-votesCount, color: '#FFF7E6', tc: '#854F0B' },
                      { label: 'Participation',   val: totalEl > 0 ? `${Math.round(votesCount/totalEl*100)}%` : '0%', color: '#F5F0FF', tc: '#534AB7' },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: s.color, borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 600, color: s.tc }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  {filteredElecteurs.length === 0
                    ? <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 13 }}>Aucun électeur trouvé.</div>
                    : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '0.5px solid #E2E8F0' }}>
                            {['CIN', 'Nom', 'Prénom', 'Email', 'Statut compte', 'Statut vote', 'Actions'].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredElecteurs.map(e => (
                            <tr key={e.id} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                              <td style={{ padding: '12px', fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>{e.cin}</td>
                              <td style={{ padding: '12px', fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{e.nom}</td>
                              <td style={{ padding: '12px', fontSize: 13, color: '#374151' }}>{e.prenom || '—'}</td>
                              <td style={{ padding: '12px', fontSize: 12, color: '#6B7280' }}>{e.email || '—'}</td>

                              <td style={{ padding: '12px' }}>
                                {e.statutValidation === 'VALIDE' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E1F5EE', color: '#0F6E56', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 11 }} /> Validé
                                  </span>
                                )}
                                {e.statutValidation === 'EN_ATTENTE' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FFF7E6', color: '#854F0B', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 11 }} /> En attente
                                  </span>
                                )}
                                {e.statutValidation === 'REFUSE' && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FEF2F2', color: '#DC2626', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: 11 }} /> Refusé
                                  </span>
                                )}
                              </td>

                              <td style={{ padding: '12px' }}>
                                {e.aVote ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E1F5EE', color: '#0F6E56', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 11 }} /> Voté
                                  </span>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F1F5F9', color: '#6B7280', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
                                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 11 }} /> Pas encore
                                  </span>
                                )}
                              </td>

                              <td style={{ padding: '12px' }}>
                                {e.statutValidation === 'EN_ATTENTE' ? (
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                      onClick={() => handleValiderElecteur(e.id)}
                                      style={{ background: '#E1F5EE', color: '#0F6E56', border: '0.5px solid #9FE1CB', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                      Valider
                                    </button>
                                    <button
                                      onClick={() => handleRefuserElecteur(e.id)}
                                      style={{ background: '#FEF2F2', color: '#DC2626', border: '0.5px solid #FECACA', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                      Refuser
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  }
                </>
              )
          )}

          {/* ── TAB PARAMÈTRES ── */}
          {tab === 'parametres' && (
            <div style={{ maxWidth: 560 }}>

              <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>
                  Statut de l'élection
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 500,
                    background: election?.statut === 'EN_COURS'  ? '#E1F5EE' :
                                election?.statut === 'TERMINEE'  ? '#FFF7E6' :
                                election?.statut === 'DEPOUILLE' ? '#EFF6FF' : '#F1F5F9',
                    color:      election?.statut === 'EN_COURS'  ? '#0F6E56' :
                                election?.statut === 'TERMINEE'  ? '#854F0B' :
                                election?.statut === 'DEPOUILLE' ? PRIMARY   : '#9CA3AF',
                    borderRadius: 6, padding: '5px 12px'
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: election?.statut === 'EN_COURS'  ? '#1D9E75' :
                                  election?.statut === 'TERMINEE'  ? '#F59E0B' :
                                  election?.statut === 'DEPOUILLE' ? PRIMARY   : '#9CA3AF',
                      display: 'inline-block'
                    }}/>
                    {election?.statut === 'EN_COURS'  ? 'Scrutin en cours' :
                     election?.statut === 'TERMINEE'  ? 'Terminée'         :
                     election?.statut === 'DEPOUILLE' ? 'Dépouillée'       : 'Inconnue'}
                  </div>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{election?.nom}</span>
                </div>

                {election?.statut === 'EN_COURS' && (
                  <div>
                    <div style={{ background: '#FFF7E6', border: '0.5px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#854F0B', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <FontAwesomeIcon icon={faStopCircle} style={{ marginTop: 1, flexShrink: 0 }}/>
                      <span>Terminer l'élection empêche tout nouveau vote. Cette action est <strong>irréversible</strong>. Assurez-vous que la période de vote est bien terminée.</span>
                    </div>
                    <button onClick={handleTerminerElection} disabled={terminating}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, background: terminating ? '#E2E8F0' : '#F59E0B', color: terminating ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: terminating ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                      <FontAwesomeIcon icon={faStopCircle} />
                      {terminating ? 'En cours...' : "Terminer l'élection"}
                    </button>
                  </div>
                )}

                {election?.statut === 'TERMINEE' && (
                  <div>
                    <div style={{ background: '#EFF6FF', border: '0.5px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: PRIMARY, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 1, flexShrink: 0 }}/>
                      <span>L'élection est terminée. Vous pouvez maintenant lancer le dépouillement pour obtenir les résultats officiels.</span>
                    </div>
                    <button onClick={() => navigate('/admin/depouillement')}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, background: PRIMARY, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <FontAwesomeIcon icon={faLockOpen} />
                      Aller au dépouillement
                    </button>
                  </div>
                )}

                {election?.statut === 'DEPOUILLE' && (
                  <div style={{ background: '#E1F5EE', border: '0.5px solid #6EE7B7', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#0F6E56', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FontAwesomeIcon icon={faCheckCircle}/>
                    L'élection est clôturée et dépouillée. Les résultats sont disponibles.
                  </div>
                )}
              </div>

              <div style={{ background: '#F8FAFC', border: '0.5px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Informations</div>
                {[
                  { label: "Nom de l'élection", val: election?.nom || '—' },
                  { label: 'Candidats',          val: candidats.length     },
                  { label: 'Électeurs inscrits', val: electeurs.length     },
                  { label: 'Votes exprimés',     val: votesCount           },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #F1F5F9', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>{item.label}</span>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL CANDIDAT ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>
              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 8, color: PRIMARY }} />
              Nouveau candidat
            </div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 5 }}>Nom *</label>
            <input value={newNom} onChange={e => setNewNom(e.target.value)} placeholder="Ex: Candidat A"
              style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, marginBottom: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 5 }}>Description</label>
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description du programme..." rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, marginBottom: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            {modalError && <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{modalError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowModal(false); setNewNom(''); setNewDesc(''); setModalError(''); }}
                style={{ flex: 1, padding: '9px', border: '0.5px solid #E2E8F0', borderRadius: 8, background: '#F9FAFB', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleAddCandidat} disabled={saving}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: PRIMARY, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {saving ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ÉLECTEUR ── */}
      {showElModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>
              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: 8, color: PRIMARY }} />
              Nouvel électeur
            </div>
            {[
              { key: 'cin',    label: 'CIN *',  ph: 'Ex: AB123456'      },
              { key: 'nom',    label: 'Nom *',  ph: 'Nom de famille'     },
              { key: 'prenom', label: 'Prénom', ph: 'Prénom'             },
              { key: 'email',  label: 'Email',  ph: 'email@exemple.com' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input value={newEl[f.key]} onChange={e => setNewEl(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.ph}
                  style={{ width: '100%', padding: '9px 12px', border: '0.5px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            ))}
            {elError && <div style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{elError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowElModal(false); setNewEl({ cin: '', nom: '', prenom: '', email: '' }); setElError(''); }}
                style={{ flex: 1, padding: '9px', border: '0.5px solid #E2E8F0', borderRadius: 8, background: '#F9FAFB', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
              <button onClick={handleAddElecteur} disabled={savingEl}
                style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: PRIMARY, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {savingEl ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}