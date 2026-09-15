import { Link } from 'react-router-dom';

function Navbar() {
  const linkStyle = {
    color: 'white', textDecoration: 'none', marginRight: 22, fontWeight: 500, fontSize: 14
  };

  return (
    <div className="gov-header">
      <div className="gov-header-top">
        <div style={{ fontSize: 26 }}>🛡️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>WEATHERGUARD</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Integrated Weather Monitoring &amp; Disaster Risk Alert Platform</div>
        </div>
        <Link to="/" style={{ padding: '8px 16px', background: 'white', color: '#0b3d6b', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14, marginRight: 10 }}>Home</Link>
        <Link to="/login" style={{ padding: '8px 16px', border: '1px solid white', color: 'white', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Admin Login</Link>
      </div>
      <div style={{ background: '#082a4d', padding: '8px 30px', display: 'flex' }}>
        <Link to="/dashboard" style={linkStyle}>Weather</Link>
        <Link to="/guidelines" style={linkStyle}>Guidelines</Link>
        <Link to="/risk-alerts" style={linkStyle}>Risk &amp; Alerts</Link>
        <Link to="/trends" style={linkStyle}>Trends</Link>
      </div>
      <div className="gov-header-stripe"></div>
    </div>
  );
}

export default Navbar;