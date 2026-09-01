import { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';

function Trends() {
  const [location, setLocation] = useState('Kochi');
  const [data, setData] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/weather/history', {
        params: { location: location }
      });
      const reversed = res.data.slice().reverse();
      const formatted = reversed.map(function (item) {
        const time = new Date(item.fetchedAt).toLocaleTimeString();
        return {
          time: time,
          temperature: item.temperature,
          humidity: item.humidity,
          windSpeed: item.windSpeed
        };
      });
      setData(formatted);
    } catch (err) {
      alert('Failed to fetch history');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h3>Weather Trends</h3>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" style={{ padding: 8, flex: 1 }} />
          <button onClick={fetchHistory} style={{ padding: '8px 16px' }}>Load Trend</button>
        </div>

        {data.length > 0 && (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#d9534f" name="Temperature (C)" />
                <Line type="monotone" dataKey="humidity" stroke="#2a5298" name="Humidity (%)" />
                <Line type="monotone" dataKey="windSpeed" stroke="#5cb85c" name="Wind Speed (km/h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.length === 0 && <p>No data loaded yet. Click "Load Trend" to fetch history.</p>}
      </div>
    </div>
  );
}

export default Trends;