import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LEVEL_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  SEVERE: '#7f1d1d'
};

function LevelBadge({ level }) {
  const color = LEVEL_COLORS[level] || '#9ca3af';
  return (
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 3, background: color, color: 'white', fontWeight: 700, fontSize: 13 }}>
      {level}
    </span>
  );
}

function RiskAlerts() {
  const [location, setLocation] = useState('Kochi');
  const [lat, setLat] = useState('9.9312');
  const [lon, setLon] = useState('76.2673');
  const [disasterType, setDisasterType] = useState('FLOOD');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [findingLocation, setFindingLocation] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/alerts/timeline');
      setTimeline(res.data);
    } catch (err) {
      // timeline is optional
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  const findLocation = async () => {
    if (!location) {
      alert('Please type a location name first');
      return;
    }
    setFindingLocation(true);
    try {
      const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: location, count: 1 }
      });
      const results = res.data.results;
      if (results && results.length > 0) {
        setLat(results[0].latitude);
        setLon(results[0].longitude);
      } else {
        alert('Location not found. Try a different name.');
      }
    } catch (err) {
      alert('Failed to look up location');
    }
    setFindingLocation(false);
  };

  const checkRisk = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/risk/assess', {
        params: { location: location, lat: lat, lon: lon, disasterType: disasterType }
      });
      setResult(res.data);
      loadTimeline();
    } catch (err) {
      alert('Failed to check risk');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = { background: '#f4f6f9', padding: 20, borderRadius: 10, marginTop: 20 };
  const labelStyle = { display: 'block', fontSize: 12, marginBottom: 4, color: '#555' };

  const risk = result ? result.risk : null;
  const weather = result ? result.weather : null;
  const alertData = result ? result.alert : null;
  const guidelines = result && result.guidelines ? result.guidelines : [];

  const heading = risk ? risk.locationName + ' - ' + risk.disasterType : '';
  const scoreLine = risk ? 'Score: ' + risk.riskScore + '/100' : '';
  const weatherLine = weather
    ? 'Temperature: ' + weather.temperature + ' C | Humidity: ' + weather.humidity + '% | Wind: ' + weather.windSpeed + ' km/h | Rain now: ' + weather.precipitation + ' mm | Rain today: ' + (weather.dailyPrecipitation || 0) + ' mm'
    : '';

  return (
    <div>
      <Navbar />

      <div style={{ padding: '30px 40px', maxWidth: 900, margin: '0 auto' }}>
        <h3>Risk and Alerts</h3>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>City / Location</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: 8, flex: 1 }} />
              <button onClick={findLocation} disabled={findingLocation} style={{ padding: '8px 12px' }}>
                {findingLocation ? 'Finding...' : 'Find'}
              </button>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Latitude</label>
            <input value={lat} onChange={(e) => setLat(e.target.value)} style={{ padding: 8, width: 100 }} />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input value={lon} onChange={(e) => setLon(e.target.value)} style={{ padding: 8, width: 100 }} />
          </div>
          <div>
            <label style={labelStyle}>Hazard</label>
            <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)} style={{ padding: 8 }}>
              <option value="FLOOD">Flood</option>
              <option value="CYCLONE">Cyclone / Wind</option>
              <option value="HEATWAVE">Heatwave</option>
              <option value="LIGHTNING">Lightning</option>
            </select>
          </div>
        </div>

        <button onClick={checkRisk} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Checking...' : 'Check Risk'}
        </button>

        {risk && (
          <div style={cardStyle}>
            <h4>{heading}</h4>
            <LevelBadge level={risk.riskLevel} />
            <span style={{ marginLeft: 10, fontWeight: 600 }}>{scoreLine}</span>
            <p style={{ marginTop: 10, color: '#444' }}>{risk.explanation}</p>
            <p style={{ fontSize: 13, color: '#666' }}>{weatherLine}</p>
          </div>
        )}

        {risk && (
          <div style={cardStyle}>
            <h4>Alert</h4>
            {alertData ? (
              <div>
                <LevelBadge level={alertData.riskLevel} />
                <p style={{ marginTop: 10 }}>{alertData.message}</p>
              </div>
            ) : (
              <p>No alert issued. Risk is LOW.</p>
            )}
          </div>
        )}

        {risk && (
          <div style={cardStyle}>
            <h4>Safety guidance</h4>
            {guidelines.length === 0 && (
              <p style={{ color: '#777' }}>No specific guidance on file for this level yet.</p>
            )}
            <ul>
              {guidelines.map((g) => (
                <li key={g.id}>{g.instructions}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 30 }}>
          <h3>Alert Timeline</h3>
          {timeline.length === 0 && <p style={{ color: '#777' }}>No alerts recorded yet.</p>}
          {timeline.map((a) => (
            <div key={a.id} style={{ borderLeft: '4px solid #0b3d6b', background: '#f4f6f9', padding: 10, marginTop: 8 }}>
              <strong>{a.locationName}</strong> - {a.disasterType} ({a.riskLevel})
              <span style={{ float: 'right', fontSize: 12, color: '#777' }}>
                {a.source === 'OFFICIAL' ? 'Official' : 'WeatherGuard'}
              </span>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{a.message}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RiskAlerts;