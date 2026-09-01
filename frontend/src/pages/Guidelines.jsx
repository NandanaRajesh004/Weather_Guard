import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Guidelines() {
  const [guidelines, setGuidelines] = useState([]);
  const [disasterType, setDisasterType] = useState('FLOOD');

  const fetchGuidelines = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/guidelines/type/' + disasterType);
      setGuidelines(res.data);
    } catch (err) {
      alert('Failed to fetch guidelines');
    }
  };

  const renderGuideline = (g) => {
    const text = g.riskLevel + ' risk: ' + g.instructions;
    return <li key={g.id}>{text}</li>;
  };

  return (
    <div style={{
      maxWidth: 700, margin: '40px auto', background: 'white',
      borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden'
    }}>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h3>Emergency Guidelines</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
            <option value="FLOOD">Flood</option>
            <option value="CYCLONE">Cyclone</option>
            <option value="HEATWAVE">Heatwave</option>
          </select>
          <button onClick={fetchGuidelines} style={{ padding: '8px 16px' }}>Get Guidelines</button>
        </div>

        <ul>
          {guidelines.map(renderGuideline)}
        </ul>
      </div>
    </div>
  );
}

export default Guidelines;