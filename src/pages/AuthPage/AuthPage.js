import { useState } from "react";
import {
  FaVoteYea,
  FaLock,
  FaUserShield,
  FaCheckCircle,
  FaIdCard,
  FaKey,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import { MdSecurity } from "react-icons/md";

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f9",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 32px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 34, height: 34,
    background: "linear-gradient(135deg,#0F766E,#3b82f6)",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 16,
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: "Georgia, serif" },
  logoBlue: { color: "#0F766E" },
  topbarInfo: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" },
  pageWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" },
  card: {
    display: "flex", width: "100%", maxWidth: 900,
    background: "#fff", borderRadius: 20,
    boxShadow: "0 4px 40px rgba(15,23,42,0.08)",
    overflow: "hidden", minHeight: 520,
  },
  side: {
    width: "42%",
    background: "linear-gradient(160deg,#0F766E 0%,#1e40af 60%,#1e3a8a 100%)",
    padding: "48px 40px",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
  },
  sideLabel: { fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 16 },
  sideTitle: { fontFamily: "Georgia, serif", fontSize: 30, color: "#fff", fontWeight: 600, lineHeight: 1.3, marginBottom: 12 },
  sideSub: { fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 },
  features: { display: "flex", flexDirection: "column", gap: 12, margin: "28px 0" },
  featRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.8)" },
  electionBadge: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 10, padding: "14px 16px",
  },
  badgeLabel: { fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 },
  badgeName: { fontSize: 15, color: "#fff", fontWeight: 600 },
  badgeDate: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  formSide: { flex: 1, padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" },
  formTitle: { fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 600, color: "#0f172a", marginBottom: 6 },
  formSub: { fontSize: 14, color: "#64748b", marginBottom: 32 },
  alert: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 10, padding: "12px 14px", marginBottom: 20,
    fontSize: 13, color: "#dc2626",
  },
  formGroup: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 },
  inputWrap: { position: "relative" },
  input: {
    width: "100%", padding: "12px 16px 12px 44px",
    fontSize: 14, fontFamily: "inherit",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    outline: "none", color: "#0f172a", background: "#fff",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  forgot: { display: "block", textAlign: "right", fontSize: 12, color: "#0F766E", cursor: "pointer", marginTop: -12, marginBottom: 24, fontWeight: 500 },
  submitBtn: {
    width: "100%", padding: 13,
    background: "linear-gradient(135deg,#0F766E,#2563eb)",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 15, fontWeight: 600, fontFamily: "inherit",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, letterSpacing: "0.01em",
  },
  footer: { marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerHelp: { fontSize: 12, color: "#94a3b8" },
  secBadge: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" },
  successWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" },
  successIcon: { width: 72, height: 72, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#16a34a" },
  successTitle: { fontFamily: "Georgia, serif", fontSize: 22, color: "#0f172a", fontWeight: 600 },
  successMsg: { fontSize: 14, color: "#64748b", maxWidth: 280, lineHeight: 1.6 },
  successRef: { fontSize: 12, fontFamily: "monospace", background: "#f1f5f9", padding: "6px 14px", borderRadius: 6, color: "#334155" },
  continueBtn: {
    marginTop: 8, padding: "12px 28px",
    background: "#0F766E", color: "#fff",
    border: "none", borderRadius: 10,
    fontSize: 14, fontWeight: 600, fontFamily: "inherit",
    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
  },
};

const DEMO = { cin: "AB123456", password: "vote2026" };

export default function AuthPage({ onSuccess }) {
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionRef, setSessionRef] = useState("");

  const handleLogin = () => {
    if (!cin.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (cin.trim() === DEMO.cin && password === DEMO.password) {
        const ref = "SESSION-" + Math.random().toString(36).substr(2, 10).toUpperCase();
        setSessionRef(ref);
        setSuccess(true);
      } else {
        setError("Identifiants incorrects. (Démo : AB123456 / vote2026)");
        setTimeout(() => setError(""), 4000);
      }
    }, 1400);
  };

  return (
    <div style={styles.wrapper}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>  <FaVoteYea size={18} />
</div>
          <div style={styles.logoText}>Vote<span style={styles.logoBlue}>Secure</span></div>
        </div>
        <div style={styles.topbarInfo}>
          <span style={{ color: "#22c55e" }}>●</span>
          Scrutin en cours · Élection Étudiante 2026
        </div>
      </div>

      {/* Main */}
      <div style={styles.pageWrap}>
        <div style={styles.card}>
          {/* Left side */}
          <div style={styles.side}>
            <div>
              <div style={styles.sideLabel}>Plateforme de vote</div>
              <div style={styles.sideTitle}>Votez en toute<br />sécurité</div>
              <div style={styles.sideSub}>Système de vote électronique sécurisé par chiffrement de bout en bout.</div>
            </div>
           <div style={styles.features}>
  <div style={styles.featRow}>
    <FaLock />
    <span>Chiffrement asymétrique (ElGamal)</span>
  </div>

  <div style={styles.featRow}>
    <MdSecurity />
    <span>Authentification à deux facteurs</span>
  </div>

  <div style={styles.featRow}>
    <FaUserShield />
    <span>Anonymat garanti</span>
  </div>

  <div style={styles.featRow}>
    <FaCheckCircle />
    <span>Vote unique vérifié</span>
  </div>
</div>
            <div style={styles.electionBadge}>
              <div style={styles.badgeLabel}>Scrutin actif</div>
              <div style={styles.badgeName}>Élection Étudiante 2026</div>
              <div style={styles.badgeDate}>Clôture le 20 déc. 2026 à 18h00</div>
            </div>
          </div>

          {/* Right side */}
          <div style={styles.formSide}>
            {!success ? (
              <>
                <div>
                  <div style={styles.formTitle}>Connexion électeur</div>
                  <div style={styles.formSub}>Entrez vos identifiants pour accéder au scrutin</div>
                </div>

                {error && (
                  <div style={styles.alert}>
                    ⚠️ <span>{error}</span>
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>CIN / Identifiant électeur</label>
                  <div style={styles.inputWrap}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 18 }}><FaIdCard /></span>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="ex: AB123456 ou VT-000842"
                      value={cin}
                      onChange={e => setCin(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Mot de passe</label>
                  <div style={styles.inputWrap}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 18 }}><FaKey /></span>
                    <input
                      style={{ ...styles.input, paddingRight: 44 }}
                      type={showPw ? "text" : "password"}
                      placeholder="Votre mot de passe secret"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPw ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <span style={styles.forgot}>Mot de passe oublié ?</span>

                <button style={styles.submitBtn} onClick={handleLogin} disabled={loading}>
                  {loading ? (
                    <span>Vérification en cours...</span>
                  ) : (
                    <span
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <FaLock />
  Se connecter
</span>
                  )}
                </button>

                <div style={styles.footer}>
                  <div style={styles.footerHelp}>Besoin d'aide ? <span style={{ color: "#1a56db", cursor: "pointer" }}>Contacter le support</span></div>
                  <div style={styles.secBadge}><FaLock />
<span>TLS 1.3</span></div>
                </div>
              </>
            ) : (
              <div style={styles.successWrap}>
                <div style={styles.successIcon}><FaCheckCircle size={36} /></div>
                <div style={styles.successTitle}>Authentification réussie</div>
                <div style={styles.successMsg}>Bienvenue ! Votre identité a été vérifiée. Vous allez être redirigé vers votre tableau de bord.</div>
                <div style={styles.successRef}>{sessionRef}</div>
                <button style={styles.continueBtn} onClick={() => onSuccess && onSuccess(sessionRef)}>
                  → Accéder au scrutin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}