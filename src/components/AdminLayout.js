import Navbar from './Navbar';

export default function AdminLayout({ children }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#F4F6FB"
    }}>
      {/* Navbar fixe */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        height: "100vh",
        width: 210,
        zIndex: 100
      }}>
        <Navbar />
      </div>

      {/* Contenu décalé */}
      <div style={{
        marginLeft: 210,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  );
}