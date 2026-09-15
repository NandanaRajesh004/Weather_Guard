import { Link } from 'react-router-dom';
import { useState } from 'react';

function NavWithDropdown() {
  var openState = useState(false);
  var open = openState[0];
  var setOpen = openState[1];

  var itemStyle = { color: 'white', textDecoration: 'none', marginRight: 22, fontSize: 14 };

  return (
    <div style={{ background: '#082a4d', padding: '8px 30px', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <a href="#home" style={itemStyle}>Home</a>
      <a href="#about" style={itemStyle}>About</a>
      <div
        onMouseEnter={function () { setOpen(true); }}
        onMouseLeave={function () { setOpen(false); }}
        style={{ position: 'relative', marginRight: 22 }}
      >
        <span style={{ color: 'white', fontSize: 14, cursor: 'pointer' }}>Features ▾</span>
        {open && (
          <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, minWidth: 160, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 10 }}>
            <Link to="/dashboard" style={{ display: 'block', padding: '10px 14px', color: '#0b3d6b', textDecoration: 'none', fontSize: 14 }}>Weather</Link>
            <Link to="/guidelines" style={{ display: 'block', padding: '10px 14px', color: '#0b3d6b', textDecoration: 'none', fontSize: 14 }}>Guidelines</Link>
            <Link to="/risk-alerts" style={{ display: 'block', padding: '10px 14px', color: '#0b3d6b', textDecoration: 'none', fontSize: 14 }}>Risk &amp; Alerts</Link>
            <Link to="/trends" style={{ display: 'block', padding: '10px 14px', color: '#0b3d6b', textDecoration: 'none', fontSize: 14 }}>Trends</Link>
          </div>
        )}
      </div>
      <Link to="/contact" style={itemStyle}>Contact Us</Link>
    </div>
  );
}

function Landing() {
  return (
    <div>
      <div className="gov-header">
        <div className="gov-header-top">
          <div style={{ fontSize: 26 }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>WEATHERGUARD</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Integrated Weather Monitoring &amp; Disaster Risk Alert Platform</div>
          </div>
         <Link to="/login" style={{ padding: '8px 16px', background: 'white', color: '#0b3d6b', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Admin Login</Link>
        </div>
               <NavWithDropdown />
        <div className="gov-header-stripe"></div>
      </div>

      <div id="home" style={{ background: '#0b3d6b', color: 'white', padding: '60px 30px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 32, marginBottom: 10 }}>Stay Ahead of the Weather</h1>
        <p style={{ fontSize: 16, maxWidth: 600, margin: '0 auto 25px', opacity: 0.9 }}>
          Real-time weather monitoring, automated risk assessment, and emergency guidance in one unified platform.
        </p>
            <Link to="/dashboard" style={{ padding: '12px 28px', background: '#ff9933', color: '#0b3d6b', borderRadius: 3, textDecoration: 'none', fontWeight: 700 }}>Check Weather Now</Link>
      </div>

      <div id="about" style={{ padding: '50px 30px', maxWidth: 800, margin: '0 auto' }}>
        <h2>About WeatherGuard</h2>
        <p style={{ lineHeight: 1.7, color: '#333' }}>
          WeatherGuard is an integrated platform designed to help citizens and local authorities stay informed
          about weather conditions and potential disaster risks. By combining live weather data with automated
          risk analysis, the platform delivers timely alerts and actionable emergency guidance, aiming to
          improve disaster preparedness across communities.
        </p>
      </div>

      <div id="features" style={{ padding: '50px 30px', background: 'white' }}>
        <h2 style={{ textAlign: 'center' }}>Platform Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 1000, margin: '30px auto 0' }}>
          <Link to="/dashboard" style={{ border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <h4>Live Weather Data</h4>
            <p style={{ fontSize: 14, color: '#555' }}>Real-time temperature, humidity, wind, and precipitation for any location.</p>
          </Link>
          <Link to="/risk-alerts" style={{ border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <h4>Risk Analysis</h4>
            <p style={{ fontSize: 14, color: '#555' }}>Automatic risk scoring based on live weather thresholds.</p>
          </Link>
          <Link to="/guidelines" style={{ border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <h4>Emergency Alerts</h4>
            <p style={{ fontSize: 14, color: '#555' }}>Actionable alerts linked directly to official safety guidelines.</p>
          </Link>
          <Link to="/trends" style={{ border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <h4>Weather Trends</h4>
            <p style={{ fontSize: 14, color: '#555' }}>Visualized historical data to track patterns over time.</p>
          </Link>
        </div>  
      </div>

      <div className="gov-footer">
        <p>&copy; 2026 WeatherGuard. A student initiative for disaster preparedness.</p>
        <p><Link to="/contact" style={{ color: '#d5d9dd' }}>Contact Us</Link></p>
      </div>
    </div>
  );
}

export default Landing;