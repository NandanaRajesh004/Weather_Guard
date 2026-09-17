import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function getWeatherIcon(code) {
  if (code === 0) return 'sun';
  if (code >= 1 && code <= 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  if (code >= 95) return 'storm';
  return 'thermometer';
}

function getWeatherEmoji(code) {
  var kind = getWeatherIcon(code);
  if (kind === 'sun') return String.fromCodePoint(0x2600);
  if (kind === 'cloud') return String.fromCodePoint(0x26C5);
  if (kind === 'fog') return String.fromCodePoint(0x1F32B);
  if (kind === 'rain') return String.fromCodePoint(0x1F327);
  if (kind === 'snow') return String.fromCodePoint(0x2744);
  if (kind === 'showers') return String.fromCodePoint(0x1F326);
  if (kind === 'storm') return String.fromCodePoint(0x26C8);
  return String.fromCodePoint(0x1F321);
}

function getRecommendation(weather) {
  var tips = [];
  var code = weather.weatherCode;
  var temp = weather.temperature;
  var precip = weather.precipitation;
  var dailyPrecip = weather.dailyPrecipitation || 0;

  if ((code >= 51 && code <= 82) || precip > 0.1 || dailyPrecip > 1) {
    tips.push(String.fromCodePoint(0x2614) + ' Looks like rain today - dont forget your umbrella!');
  }
  if (temp >= 35) {
    tips.push(String.fromCodePoint(0x1F9F4) + ' Its going to be a hot one - grab your sunscreen!');
    tips.push(String.fromCodePoint(0x1F4A7) + ' Remember to sip water often and stay cool.');
  }
  if (temp <= 15) {
    tips.push(String.fromCodePoint(0x1F9E5) + ' A bit chilly out there - a cozy jacket would help.');
  }
  if (tips.length === 0) {
    tips.push(String.fromCodePoint(0x1F31E) + ' Lovely weather today - enjoy your day!');
  }
  return tips;
}

function Dashboard() {
  var locationState = useState('Kochi');
  var location = locationState[0];
  var setLocation = locationState[1];

  var latState = useState('9.9312');
  var lat = latState[0];
  var setLat = latState[1];

  var lonState = useState('76.2673');
  var lon = lonState[0];
  var setLon = lonState[1];

  var weatherState = useState(null);
  var weather = weatherState[0];
  var setWeather = weatherState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

    var findingState = useState(false);
  var findingLocation = findingState[0];
  var setFindingLocation = findingState[1];

  var findLocation = function () {
    if (!location) {
      alert('Please type a location name first');
      return;
    }
    setFindingLocation(true);
    axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: location, count: 1 }
    }).then(function (res) {
      var results = res.data.results;
      if (results && results.length > 0) {
        setLat(results[0].latitude);
        setLon(results[0].longitude);
      } else {
        alert('Location not found. Try a different name.');
      }
      setFindingLocation(false);
    }).catch(function () {
      alert('Failed to look up location');
      setFindingLocation(false);
    });
  };

  var fetchWeather = function () {
    setLoading(true);
    axios.get('http://localhost:8080/api/weather/fetch', {
      params: { location: location, lat: lat, lon: lon }
    }).then(function (res) {
      setWeather(res.data);
      setLoading(false);
    }).catch(function () {
      alert('Failed to fetch weather');
      setLoading(false);
    });
  };

  var weatherBlock = null;

  if (weather) {
    var tips = getRecommendation(weather);
    var tipItems = tips.map(function (tip, index) {
      return <li key={index} style={{ background: 'transparent', borderLeft: 'none', padding: '4px 0' }}>{tip}</li>;
    });

    weatherBlock = (
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span className="weather-icon">{getWeatherEmoji(weather.weatherCode)}</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1e3c72' }}>{weather.locationName}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{weather.temperature} C</div>
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

        <div style={{ marginTop: 15, padding: 15, background: '#fff8e1', borderRadius: 8, borderLeft: '4px solid #f0ad4e' }}>
          <strong>Heres a little tip for today:</strong>
          <ul style={{ marginTop: 8 }}>
            {tipItems}
          </ul>
        </div>
      </div>
    );
  }

   return (
    <div>
      <Navbar />

      <div style={{ padding: '30px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ background: '#f4f6f9', padding: 20, borderRadius: 10 }}>
          <h3>Weather Data</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>City / Location</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={location} onChange={function (e) { setLocation(e.target.value); }} style={{ padding: 8, flex: 1 }} />
                <button onClick={findLocation} disabled={findingLocation} style={{ padding: '8px 12px' }}>
                  {findingLocation ? 'Finding...' : 'Find'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Latitude</label>
              <input value={lat} onChange={function (e) { setLat(e.target.value); }} style={{ padding: 8, width: 100 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Longitude</label>
              <input value={lon} onChange={function (e) { setLon(e.target.value); }} style={{ padding: 8, width: 100 }} />
            </div>
          </div>
          <button onClick={fetchWeather} disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? 'Loading...' : 'Fetch Weather'}
          </button>

                    {weatherBlock}
         </div>
      </div>
      <Footer />
    </div>
  );
}
export default Dashboard;