import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import KeralaTrends from '../components/KeralaTrends';

var HAZARDS = [
  { to: '/map/flood', title: 'Flood', text: 'District-wise flood risk from forecast and current rainfall.' },
  { to: '/map/lightning', title: 'Lightning', text: 'Thunderstorm and lightning risk across Kerala.' },
  { to: '/map/cyclone', title: 'Cyclone / Wind', text: 'Strong wind and cyclone-related conditions.' },
  { to: '/map/heatwave', title: 'Heatwave', text: 'Heat stress from temperature and humidity.' }
];

function levelColor(level) {
  if (level === 'SEVERE') return '#7f1d1d';
  if (level === 'HIGH') return '#ef4444';
  if (level === 'MODERATE') return '#f59e0b';
  if (level === 'LOW') return '#22c55e';
  return '#9ca3af';
}

function Landing() {
  var alertsState = useState([]);
  var alerts = alertsState[0];
  var setAlerts = alertsState[1];

  var loadedState = useState(false);
  var loaded = loadedState[0];
  var setLoaded = loadedState[1];

  useEffect(function () {
    axios.get('http://localhost:8080/api/alerts/timeline')
      .then(function (res) {
        setAlerts(res.data);
        setLoaded(true);
      })
      .catch(function () {
        setLoaded(true);
      });
  }, []);

  var cutoff = Date.now() - 48 * 60 * 60 * 1000;
  var recent = alerts
    .filter(function (a) { return new Date(a.createdAt).getTime() >= cutoff; })
    .slice(0, 6);

  var heroButton = {
    display: 'inline-block',
    padding: '12px 24px',
    margin: '0 6px 8px',
    borderRadius: 3,
    textDecoration: 'none',
    fontWeight: 700
  };

  return (
    <div>
      <Navbar />

      <div style={{ background: '#0b3d6b', color: 'white', padding: '50px 30px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 32, margin: '0 0 10px' }}>Kerala Weather and Disaster Risk Monitor</h1>
        <p style={{ fontSize: 16, maxWidth: 650, margin: '0 auto 24px', opacity: 0.9 }}>
          Live district-level risk for floods, lightning, cyclone winds and heatwaves, with clear guidance on what to do.
        </p>
        <Link to="/risk-alerts" style={{ ...heroButton, background: '#ff9933', color: '#0b3d6b' }}>Check risk for your location</Link>
        <Link to="/guidelines" style={{ ...heroButton, border: '1px solid white', color: 'white' }}>Safety guidelines</Link>
      </div>

      <div style={{ padding: '40px 30px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Hazard Maps</h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: 24 }}>Select a hazard to open its district risk map.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
          {HAZARDS.map(function (h) {
            return (
              <Link
                key={h.to}
                to={h.to}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: 'white', border: '1px solid #d5d9dd', borderTop: '4px solid #0b3d6b', borderRadius: 4, padding: 18 }}
              >
                <h4 style={{ margin: '0 0 6px' }}>{h.title}</h4>
                <p style={{ fontSize: 14, color: '#555', margin: '0 0 10px' }}>{h.text}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0b3d6b' }}>Open map</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'white', padding: '40px 30px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2>Latest Alerts</h2>
          <p style={{ color: '#555' }}>
            Alerts raised in the last 48 hours. These come from WeatherGuard's own analysis of weather data and are not official government warnings. For official warnings, follow KSDMA and IMD.
          </p>

          {!loaded && <p>Loading alerts...</p>}

          {loaded && recent.length === 0 && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 4 }}>
              No alerts in the last 48 hours. Use Check Risk to assess a specific location.
            </div>
          )}

          {recent.map(function (a) {
            return (
              <div key={a.id} style={{ borderLeft: '6px solid ' + levelColor(a.riskLevel), background: '#f4f6f9', padding: 12, marginTop: 10 }}>
                <strong>{a.locationName}</strong> - {a.disasterType}
                <span style={{ marginLeft: 8, padding: '2px 10px', borderRadius: 3, background: levelColor(a.riskLevel), color: 'white', fontSize: 12, fontWeight: 700 }}>
                  {a.riskLevel}
                </span>
                <span style={{ float: 'right', fontSize: 12, color: '#777' }}>
                  {a.source === 'OFFICIAL' ? 'Official alert' : 'WeatherGuard analysis'}
                </span>
                <div style={{ fontSize: 14, color: '#444', marginTop: 6 }}>{a.message}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      <KeralaTrends />
      <p style={{ textAlign: 'center', background: 'white', margin: 0, padding: '0 0 30px' }}>
        <Link to="/trends" style={{ color: '#0b3d6b', fontWeight: 600 }}>Look up trends for a single location</Link>
      </p>

      <div style={{ padding: '40px 30px', maxWidth: 800, margin: '0 auto' }}>
        <h2>About WeatherGuard</h2>
        <p style={{ lineHeight: 1.7, color: '#333' }}>
          WeatherGuard combines live weather data from Open-Meteo with a multi-factor risk score for each of Kerala's 14 districts.
          For floods, lightning, cyclone winds and heatwaves it explains why a risk level was given, raises alerts when risk
          rises, and shows the safety guidance that applies. It is a decision-support tool and does not replace official
          warnings from IMD or KSDMA.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;