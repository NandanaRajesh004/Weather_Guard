import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

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
        <div style={{ background: '#f4f6f9', padding: 20, borderRadius: 10 }}>
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
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <span className="weather-icon">{getWeatherIcon(weather.weatherCode)}</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1e3c72' }}>{weather.locationName}</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{weather.temperature}°C</div>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-box">
                  <div className="label">Humidity</div>
                  <div className="value">{weather.humidity}%</div>
                </div>
                <div className="stat-box">
                  <div className="label">Wind Speed</div>
                  <div className="value">{weather.windSpeed} km/h</div>
                </div>
                <div className="stat-box">
                  <div className="label">Precipitation</div>
                  <div className="value">{weather.precipitation} mm</div>
                </div>
                <div className="stat-box">
                  <div className="label">Fetched</div>
                  <div className="value" style={{ fontSize: 13 }}>{new Date(weather.fetchedAt).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;