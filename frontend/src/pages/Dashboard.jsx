import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [location, setLocation] = useState('Kochi');
  const [lat, setLat] = useState('9.9312');
  const [lon, setLon] = useState('76.2673');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/weather/fetch', {
        params: { location: location, lat: lat, lon: lon }
      });
      setWeather(res.data);
    } catch (err) {
      alert('Failed to fetch weather');
    }
  };

  return (
    <div style={{
      maxWidth: 700, margin: '40px auto', background: 'white',
      borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden'
    }}>
      <Navbar />

      <div style={{ padding: 30 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3>Weather Data</h3>
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
          </div>
          <button onClick={fetchWeather} style={{ padding: '8px 16px' }}>Fetch Weather</button>

          {weather && (
            <div style={{ marginTop: 15, padding: 15, background: '#f4f6f9', borderRadius: 8 }}>
              <p>Location: {weather.locationName}</p>
              <p>Temperature: {weather.temperature} C</p>
              <p>Humidity: {weather.humidity} percent</p>
              <p>Wind Speed: {weather.windSpeed} km/h</p>
              <p>Precipitation: {weather.precipitation} mm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;