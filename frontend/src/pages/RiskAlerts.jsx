import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function RiskAlerts() {
  const [location, setLocation] = useState('Kochi');
  const [lat, setLat] = useState('9.9312');
  const [lon, setLon] = useState('76.2673');
  const [disasterType, setDisasterType] = useState('FLOOD');
  const [risk, setRisk] = useState(null);
  const [alertResult, setAlertResult] = useState(null);

  const [riskLoading, setRiskLoading] = useState(false);
const [alertLoading, setAlertLoading] = useState(false);

const checkRisk = async () => {
    setRiskLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/risk/analyze', {
        params: { location: location, lat: lat, lon: lon, disasterType: disasterType }
      });
      setRisk(res.data);
    } catch (err) {
      alert('Failed to analyze risk');
    } finally {
      setRiskLoading(false);
    }
  };

  const checkAlert = async () => {
    setAlertLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/alerts/check', {
        params: { location: location, lat: lat, lon: lon, disasterType: disasterType }
      });
      setAlertResult(res.data);
    } catch (err) {
      alert('Failed to check alert');
    } finally {
      setAlertLoading(false);
    }
  };
  const badgeClass = (level) => {
    if (level === 'HIGH') return 'badge badge-high';
    if (level === 'MEDIUM') return 'badge badge-medium';
    return 'badge badge-low';
  };

  const cardStyle = { background: '#f4f6f9', padding: 20, borderRadius: 10, marginTop: 20 };

  const riskSummary = risk ? ('Location: ' + risk.locationName + ' | Disaster: ' + risk.disasterType) : '';
  const riskDetails = risk ? ('Temperature: ' + risk.temperature + ' C | Wind: ' + risk.windSpeed + ' km/h | Precipitation: ' + risk.precipitation + ' mm') : '';

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h3>Risk and Alerts</h3>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>City / Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: 8, width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Latitude</label>
            <input value={lat} onChange={(e) => setLat(e.target.value)} style={{ padding: 8, width: 100 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Longitude</label>
            <input value={lon} onChange={(e) => setLon(e.target.value)} style={{ padding: 8, width: 100 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Disaster Type</label>
            <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)} style={{ padding: 8 }}>
              <option value="FLOOD">Flood</option>
              <option value="CYCLONE">Cyclone</option>
              <option value="HEATWAVE">Heatwave</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={checkRisk} disabled={riskLoading} style={{ padding: '8px 16px' }}>
  {riskLoading ? 'Analyzing...' : 'Analyze Risk'}
</button>
<button onClick={checkAlert} disabled={alertLoading} style={{ padding: '8px 16px' }}>
  {alertLoading ? 'Checking...' : 'Check Alert'}
</button>
        </div>

        {risk && (
          <div style={cardStyle}>
            <h4>Risk Analysis Result</h4>
            <p>{riskSummary}</p>
            <p>{riskDetails}</p>
            <span className={badgeClass(risk.riskLevel)}>{risk.riskLevel} RISK</span>
          </div>
        )}

        {alertResult && (
          <div style={cardStyle}>
            <h4>Alert Result</h4>
            {alertResult.riskLevel ? (
              <div>
                <span className={badgeClass(alertResult.riskLevel)}>{alertResult.riskLevel} RISK</span>
                <p style={{ marginTop: 10 }}>{alertResult.message}</p>
              </div>
            ) : (
              <p>{alertResult.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskAlerts;