import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HAZARDS = [
  { key: 'FLOOD', label: 'Flood' },
  { key: 'CYCLONE', label: 'Cyclone / Wind' },
  { key: 'HEATWAVE', label: 'Heatwave' },
  { key: 'LIGHTNING', label: 'Lightning' }
];

const LEVELS = ['LOW', 'MODERATE', 'HIGH', 'SEVERE'];

const LEVEL_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  SEVERE: '#7f1d1d'
};

function Guidelines() {
  const [hazard, setHazard] = useState('FLOOD');
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:8080/api/guidelines/type/' + hazard)
      .then((res) => {
        setGuidelines(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load guidelines. Is the backend running?');
        setLoading(false);
      });
  }, [hazard]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px 40px', maxWidth: 900, margin: '0 auto' }}>
        <h3>Emergency Guidelines</h3>
        <p style={{ color: '#555' }}>Choose a hazard to see what to do at each risk level.</p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '16px 0' }}>
          {HAZARDS.map((h) => {
            const active = hazard === h.key;
            return (
              <button
                key={h.key}
                onClick={() => setHazard(h.key)}
                style={{
                  padding: '8px 16px',
                  background: active ? '#0b3d6b' : 'white',
                  color: active ? 'white' : '#0b3d6b',
                  border: '1px solid #0b3d6b'
                }}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: '#b03030' }}>{error}</p>}

        {!loading && !error && LEVELS.map((level) => {
          const items = guidelines.filter((g) => g.riskLevel === level);
          return (
            <div
              key={level}
              style={{ borderLeft: '6px solid ' + LEVEL_COLORS[level], background: '#f4f6f9', padding: 16, marginTop: 14, borderRadius: 4 }}
            >
              <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 3, background: LEVEL_COLORS[level], color: 'white', fontWeight: 700, fontSize: 13 }}>
                {level}
              </span>
              {items.length === 0 && <p style={{ color: '#777', marginTop: 8 }}>No guidance on file for this level.</p>}
              <ul style={{ marginTop: 8 }}>
                {items.map((g) => (
                  <li key={g.id} style={{ background: 'transparent', borderLeft: 'none', padding: '4px 0' }}>{g.instructions}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

export default Guidelines;