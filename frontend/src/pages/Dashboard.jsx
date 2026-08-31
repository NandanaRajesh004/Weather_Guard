import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [location, setLocation] = useState('Kochi');
  const [lat, setLat] = useState('9.9312');
  const [lon, setLon] = useState('76.2673');
  const [weather, setWeather] = useState(null);
  const [guidelines, setGuidelines] = useState([]);
  const [disasterType, setDisasterType] = useState('FLOOD');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

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
    return <li key={g.id} style={{ marginTop: 10 }}>{text}</li>;
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>WeatherGuard Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <section style={{ marginTop: 30 }}>
        <h3>Weather Data</h3>
        <input placeholder="Location name" value={location} onChange={(e) => setLocation(e.target.value)} style={{ marginRight: 10 }} />
        <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} style={{ marginRight: 10 }} />
        <input placeholder="Longitude" value={lon} onChange={(e) => setLon(e.target.value)} style={{ marginRight: 10 }} />
        <button onClick={fetchWeather}>Fetch Weather</button>

        {weather && (
          <div style={{ marginTop: 15, padding: 15, border: '1px solid #ccc', borderRadius: 8 }}>
            <p>Location: {weather.locationName}</p>
            <p>Temperature: {weather.temperature} C</p>
            <p>Humidity: {weather.humidity} percent</p>
            <p>Wind Speed: {weather.windSpeed} km/h</p>
            <p>Precipitation: {weather.precipitation} mm</p>
          </div>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>Emergency Guidelines</h3>
        <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)} style={{ marginRight: 10 }}>
          <option value="FLOOD">Flood</option>
          <option value="CYCLONE">Cyclone</option>
          <option value="HEATWAVE">Heatwave</option>
        </select>
        <button onClick={fetchGuidelines}>Get Guidelines</button>

        <ul>
          {guidelines.map(renderGuideline)}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;