import { useNavigate, useLocation } from 'react-router-dom';

const PRIMARY = "#072F75";

const NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard",     path: "/admin/dashboard"     },
  { icon: "ti-settings",         label: "Gestion",       path: "/admin/gestion"       },
  { icon: "ti-lock-open",        label: "Dépouillement", path: "/admin/depouillement" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation(); // ← utilise directement location ici

  const getUsername = () => {
    try {
      const token = localStorage.getItem('admin_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || 'Admin';
    } catch {
      return 'Admin';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div style={{
      width: 210,
      background: PRIMARY,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      minHeight: "100vh",
      boxShadow: "2px 0 12px rgba(7,47,117,0.15)"
    }}>

      {/* Logo */}
      <div style={{
        padding: "22px 18px 18px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: "0.5px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          width: 32, height: 32,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 8, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 16
        }}>
          <i className="ti ti-shield-check" aria-hidden="true"/>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
          VoteSecure
        </span>
      </div>

      {/* Navigation */}
      <div style={{ padding: "16px 10px", flex: 1 }}>
        <div style={{
          fontSize: 10, letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          padding: "12px 10px 8px"
        }}>
          Principal
        </div>

        {NAV.map(item => {
          const isActive = location.pathname === item.path; // ← corrigé ici
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "9px 12px", borderRadius: 8,
                fontSize: 13,
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                cursor: "pointer", marginBottom: 3,
                fontWeight: isActive ? 500 : 400,
                transition: "background 0.15s"
              }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 17 }} aria-hidden="true"/>
              {item.label}
            </div>
          );
        })}
      </div>

      {/* Utilisateur + Déconnexion */}
      <div style={{
        padding: "14px 12px",
        borderTop: "0.5px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32,
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "#fff"
          }}>
            AD
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              {getUsername()}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              Administrateur
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.2)",
              borderRadius: 7, color: "rgba(255,255,255,0.8)",
              padding: "6px 8px", fontSize: 14,
              cursor: "pointer", display: "flex",
              alignItems: "center"
            }}>
            <i className="ti ti-logout" aria-hidden="true"/>
          </button>
        </div>
      </div>
    </div>
  );
}