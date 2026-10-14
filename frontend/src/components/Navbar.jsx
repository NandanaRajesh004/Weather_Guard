import { useState } from 'react';
import { Link } from 'react-router-dom';

var HAZARD_LINKS = [
  { to: '/map/flood', label: 'Flood' },
  { to: '/map/lightning', label: 'Lightning' },
  { to: '/map/cyclone', label: 'Cyclone / Wind' },
  { to: '/map/heatwave', label: 'Heatwave' }
];

var linkStyle = { color: 'white', textDecoration: 'none', marginRight: 22, fontWeight: 500, fontSize: 14 };

function Navbar() {
  var openState = useState(false);
  var open = openState[0];
  var setOpen = openState[1];

  return (
    <div className="gov-header">
      <div style={{ background: '#06294a', color: '#d5d9dd', fontSize: 12, padding: '4px 30px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span>Kerala weather and disaster risk monitoring</span>
        <span>Emergency helpline: 112</span>
      </div>

      <div className="gov-header-top">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: 0.5 }}>WEATHERGUARD</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>Integrated Weather Monitoring &amp; Disaster Risk Alert Platform</div>
        </div>
        <Link to="/register" style={{ padding: '8px 16px', border: '1px solid white', color: 'white', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14, marginRight: 10 }}>Register</Link>
        <Link to="/login" style={{ padding: '8px 16px', background: 'white', color: '#0b3d6b', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Admin Login</Link>
      </div>

      <div style={{ background: '#082a4d', padding: '8px 30px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={linkStyle}>Home</Link>

        <div
          onMouseEnter={function () { setOpen(true); }}
          onMouseLeave={function () { setOpen(false); }}
          style={{ position: 'relative', marginRight: 22 }}
        >
          <span
            onClick={function () { setOpen(!open); }}
            style={{ color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            Hazard Maps &#9662;
          </span>
          {open && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, minWidth: 170, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 20 }}>
              {HAZARD_LINKS.map(function (h) {
                return (
                  <Link
                    key={h.to}
                    to={h.to}
                    onClick={function () { setOpen(false); }}
                    style={{ display: 'block', padding: '10px 14px', color: '#0b3d6b', textDecoration: 'none', fontSize: 14 }}
                  >
                    {h.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link to="/dashboard" style={linkStyle}>Weather</Link>
        <Link to="/risk-alerts" style={linkStyle}>Check Risk</Link>
        <Link to="/guidelines" style={linkStyle}>Guidelines</Link>
        <Link to="/ml-insights" style={linkStyle}>ML Insights</Link>
        <Link to="/contact" style={linkStyle}>Contact</Link>
      </div>

      <div className="gov-header-stripe"></div>
    </div>
  );
}

export default Navbar;