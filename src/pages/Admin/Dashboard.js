import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const PRIMARY = "#072F75";
const COLORS  = ["#072F75", "#378ADD", "#85B7EB", "#B5D4F4", "#5B9BF0", "#0C447C"];

const S = {
  topbar:    { height: 54, background: "#fff", borderBottom: "0.5px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 28px", gap: 12 },
  tbTitle:   { fontSize: 15, fontWeight: 600, color: "#0f172a", flex: 1 },
  tbBadge:   (statut) => ({ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "5px 12px", borderRadius: 6, fontWeight: 500,
    color:      statut === 'EN_COURS'  ? '#0F6E56' : statut === 'TERMINEE' ? '#854F0B' : statut === 'DEPOUILLE' ? PRIMARY : '#6B7280',
    background: statut === 'EN_COURS'  ? '#E1F5EE' : statut === 'TERMINEE' ? '#FFF7E6' : statut === 'DEPOUILLE' ? '#EFF6FF' : '#F1F5F9',
  }),
  tbBtn:     { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7280", background: "#F9FAFB", border: "0.5px solid #E2E8F0", borderRadius: 7, padding: "6px 13px", cursor: "pointer", fontFamily: "inherit" },
  content:   { padding: "24px 28px", flex: 1 },
  pgLabel:   { fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 4 },
  pgTitle:   { fontSize: 22, fontWeight: 600, color: "#0f172a", marginBottom: 22 },
  grid4:     { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 },
  statCard:  { background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 14, padding: "20px 18px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  statIcon:  (bg, c) => ({ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14, background: bg, color: c }),
  statLbl:   { fontSize: 12, color: "#9CA3AF", marginBottom: 5 },
  statVal:   { fontSize: 26, fontWeight: 600, color: "#0f172a", lineHeight: 1 },
  statSub:   (c) => ({ fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4, color: c }),
  row2:      { display: "grid", gridTemplateColumns: "1fr 290px", gap: 16 },
  card:      { background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 14, padding: 22, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardHead:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  cardSub:   { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  legRow:    { display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 },
  legItem:   { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" },
  legSq:     (bg) => ({ width: 10, height: 10, borderRadius: 3, background: bg }),
  progRows:  { display: "flex", flexDirection: "column", gap: 12 },
  progRow:   { display: "flex", flexDirection: "column", gap: 5 },
  progLbl:   { display: "flex", justifyContent: "space-between", fontSize: 13 },
  progTrack: { height: 7, background: "#F1F5F9", borderRadius: 100, overflow: "hidden" },
  progFill:  (w, bg) => ({ height: 7, borderRadius: 100, background: bg, width: w, transition: "width 0.6s ease" }),
  btnPrim:   { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer", width: "100%", marginTop: 18 },
  skeleton:  { background: "#F1F5F9", borderRadius: 6 },
};

export default function Dashboard() {
  const navigate  = useNavigate();
  const chartRef  = useRef(null);
  const chartInst = useRef(null);

  const [stats, setStats]         = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [electeurs, setElecteurs] = useState([]);
  const [resultats, setResultats] = useState([]); // ← résultats réels
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, candidatsRes, electeursRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getCandidats(),
          adminAPI.getElecteurs(),
        ]);
        setStats(statsRes.data);
        setCandidats(candidatsRes.data);
        setElecteurs(electeursRes.data);

        // Si dépouillé → charge les vrais résultats
        if (statsRes.data?.statut === 'DEPOUILLE') {
          try {
            const resRes = await adminAPI.getResultats();
            if (Array.isArray(resRes.data)) setResultats(resRes.data);
          } catch { /* pas de résultats encore */ }
        }
      } catch (err) {
        console.error('Erreur chargement dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Graphique — données réelles si dépouillé, random si en cours
  useEffect(() => {
    if (!chartRef.current || candidats.length === 0) return;
    if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null; }

    const estDepouille = stats?.statut === 'DEPOUILLE';

    // Prépare les données du graphique
    let chartData;
    if (estDepouille && resultats.length > 0) {
      // Données réelles — on mappe par nom de candidat
      chartData = candidats.map(c => {
        const r = resultats.find(r =>
          (r.candidat ?? r.nom ?? '') === c.nom
        );
        return r?.voix ?? 0;
      });
    } else {
      // Données masquées — random
      chartData = candidats.map(() => Math.floor(Math.random() * 100) + 50);
    }

    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      chartInst.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: candidats.map(c => c.nom),
          datasets: [{
            data: chartData,
            backgroundColor: candidats.map((_, i) => COLORS[i % COLORS.length]),
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => estDepouille
                  ? ` ${ctx.raw} voix`
                  : " Résultats masqués avant dépouillement"
              }
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#9CA3AF" } },
            y: {
              grid: { color: "#F8FAFC" },
              ticks: {
                color: "#9CA3AF",
                callback: estDepouille ? undefined : () => "***"
              }
            },
          },
        },
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null; }
    };
  }, [candidats, resultats, stats]);

  const activite = electeurs
    .filter(e => e.aVote)
    .slice(0, 3)
    .map(e => ({ text: `${e.prenom} ${e.nom} a voté`, dot: "#1D9E75" }));

  const s = {
    total_electeurs: stats?.total_electeurs ?? 0,
    total_votes:     stats?.total_votes     ?? 0,
    total_candidats: stats?.total_candidats ?? 0,
    taux:            stats?.taux            ?? 0,
    election:        stats?.election        ?? '...',
    statut:          stats?.statut          ?? '',
  };

  const estDepouille = s.statut === 'DEPOUILLE';

  return (
    <AdminLayout>

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.tbTitle}>{loading ? '...' : s.election}</div>
        <div style={S.tbBadge(s.statut)}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", display: "inline-block",
            background: s.statut === 'EN_COURS' ? '#1D9E75' :
                        s.statut === 'TERMINEE' ? '#F59E0B' :
                        s.statut === 'DEPOUILLE' ? PRIMARY : '#9CA3AF'
          }}/>
          {s.statut === 'EN_COURS'  ? 'Scrutin en cours' :
           s.statut === 'TERMINEE'  ? 'Élection terminée' :
           s.statut === 'DEPOUILLE' ? 'Dépouillée' : '...'}
        </div>
        <button style={S.tbBtn} onClick={() => window.location.reload()}>
          <i className="ti ti-refresh" style={{ fontSize: 14 }} aria-hidden="true"/>
          Actualiser
        </button>
      </div>

      {/* Content */}
      <div style={S.content}>
        <div style={S.pgLabel}>Vue d'ensemble</div>
        <div style={S.pgTitle}>{loading ? 'Chargement...' : s.election}</div>

        {/* Stat cards */}
        <div style={S.grid4}>
          {[
            { icon: "ti-users",        bg: "#EFF6FF", ic: PRIMARY,   label: "Total électeurs", val: s.total_electeurs.toLocaleString('fr-FR'), sub: "inscrits",     sc: "#9CA3AF", tr: "ti-minus"       },
            { icon: "ti-checkup-list", bg: "#E1F5EE", ic: "#0F6E56", label: "Votes exprimés",  val: s.total_votes.toLocaleString('fr-FR'),     sub: "enregistrés",  sc: "#059669", tr: "ti-trending-up" },
            { icon: "ti-user-check",   bg: "#F5F0FF", ic: "#534AB7", label: "Candidats",       val: s.total_candidats,                        sub: "participants", sc: "#9CA3AF", tr: "ti-minus"       },
            { faIcon: faChartPie,       bg: "#FFF7E6", ic: "#854F0B", label: "Participation",   val: `${s.taux}%`,                             sub: "taux actuel",  sc: "#059669", tr: "ti-trending-up" },
          ].map((c, i) => (
            <div key={i} style={S.statCard}>
              <div style={S.statIcon(c.bg, c.ic)}>
                {c.faIcon
                  ? <FontAwesomeIcon icon={c.faIcon} />
                  : <i className={`ti ${c.icon}`} aria-hidden="true"/>
                }
              </div>
              <div style={S.statLbl}>{c.label}</div>
              <div style={S.statVal}>
                {loading ? <span style={{ ...S.skeleton, display: "block", height: 28, width: 60 }}/> : c.val}
              </div>
              <div style={S.statSub(c.sc)}>
                <i className={`ti ${c.tr}`} style={{ fontSize: 12 }} aria-hidden="true"/>
                {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div style={S.row2}>

          {/* Graphique */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div>
                <div style={S.cardTitle}>Répartition des votes</div>
                <div style={S.cardSub}>
                  {estDepouille ? 'Résultats officiels' : 'Résultats masqués avant dépouillement'}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                color:      estDepouille ? '#0F6E56' : '#854F0B',
                background: estDepouille ? '#E1F5EE' : '#FAEEDA',
                border:     `0.5px solid ${estDepouille ? '#6EE7B7' : '#EF9F27'}`,
                borderRadius: 6, padding: "4px 10px"
              }}>
                <i className={`ti ${estDepouille ? 'ti-check' : 'ti-eye-off'}`}
                  style={{ fontSize: 13 }} aria-hidden="true"/>
                {estDepouille ? 'Dépouillé' : 'Non dépouillé'}
              </div>
            </div>
            <div style={S.legRow}>
              {candidats.map((c, i) => (
                <span key={c.id} style={S.legItem}>
                  <span style={S.legSq(COLORS[i % COLORS.length])}/>{c.nom}
                </span>
              ))}
            </div>
            <div style={{ position: "relative", height: 200 }}>
              {loading
                ? <div style={{ ...S.skeleton, height: "100%", borderRadius: 8 }}/>
                : <canvas ref={chartRef} role="img" aria-label="Graphique votes par candidat"/>
              }
            </div>
          </div>

          {/* Panel droit */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>
                {estDepouille ? 'Résultats finaux' : 'Candidats inscrits'}
              </div>
              <div style={S.cardSub}>{candidats.length} au total</div>
            </div>

            <div style={S.progRows}>
              {loading
                ? [1,2,3,4].map(i => <div key={i} style={{ ...S.skeleton, height: 32, borderRadius: 6 }}/>)
                : estDepouille && resultats.length > 0
                  // Affiche les vrais résultats
                  ? resultats
                      .sort((a, b) => (b.voix || 0) - (a.voix || 0))
                      .map((r, i) => {
                        const total = resultats.reduce((s, x) => s + (x.voix || 0), 0);
                        const pct   = total > 0 ? Math.round((r.voix || 0) / total * 100) : 0;
                        return (
                          <div key={i} style={S.progRow}>
                            <div style={S.progLbl}>
                              <span style={{ color: "#374151", fontWeight: 500, fontSize: 12 }}>
                                {r.candidat ?? r.nom ?? `Candidat ${i+1}`}
                              </span>
                              <span style={{ color: "#374151", fontSize: 12, fontWeight: 500 }}>
                                {r.voix} voix ({pct}%)
                              </span>
                            </div>
                            <div style={S.progTrack}>
                              <div style={S.progFill(`${pct}%`, COLORS[i % COLORS.length])}/>
                            </div>
                          </div>
                        );
                      })
                  // Affiche les candidats masqués
                  : candidats.map((c, i) => (
                      <div key={c.id} style={S.progRow}>
                        <div style={S.progLbl}>
                          <span style={{ color: "#374151", fontWeight: 500, fontSize: 12 }}>{c.nom}</span>
                          <span style={{ color: "#9CA3AF", fontSize: 11 }}>—</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{c.description}</div>
                        <div style={S.progTrack}>
                          <div style={S.progFill("100%", COLORS[i % COLORS.length])}/>
                        </div>
                      </div>
                    ))
              }
            </div>

            {/* Activité */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "0.5px solid #F1F5F9" }}>
              <div style={{ ...S.cardTitle, marginBottom: 12 }}>
                Électeurs ayant voté ({s.total_votes}/{s.total_electeurs})
              </div>
              {loading
                ? <div style={{ ...S.skeleton, height: 60, borderRadius: 6 }}/>
                : activite.length > 0
                  ? activite.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < activite.length - 1 ? "0.5px solid #F1F5F9" : "none" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0 }}/>
                        <div style={{ fontSize: 12, color: "#374151" }}>{a.text}</div>
                      </div>
                    ))
                  : <div style={{ fontSize: 12, color: "#9CA3AF" }}>Aucun vote enregistré</div>
              }
            </div>

            {/* Bouton dynamique */}
            {!estDepouille ? (
              <button style={S.btnPrim} onClick={() => navigate("/admin/depouillement")}>
                <i className="ti ti-lock-open" aria-hidden="true"/>
                Lancer le dépouillement
              </button>
            ) : (
              <button
                style={{ ...S.btnPrim, background: '#E1F5EE', color: '#0F6E56', cursor: 'default' }}
                onClick={() => navigate("/admin/depouillement")}>
                <i className="ti ti-check" aria-hidden="true"/>
                Voir les résultats complets
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}