import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <div>
      <Navbar />

      <div style={{ padding: '30px 40px', maxWidth: 900, margin: '0 auto' }}>
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
      <Footer />
    </div>
  );
}

export default Guidelines;