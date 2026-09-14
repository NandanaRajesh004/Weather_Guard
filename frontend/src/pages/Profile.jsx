import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Profile() {
  var nameState = useState('');
  var name = nameState[0];
  var setName = nameState[1];

  var locationState = useState('');
  var location = locationState[0];
  var setLocation = locationState[1];

  var latState = useState('');
  var lat = latState[0];
  var setLat = latState[1];

  var lonState = useState('');
  var lon = lonState[0];
  var setLon = lonState[1];

  var savedState = useState(false);
  var saved = savedState[0];
  var setSaved = savedState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var getAuthHeader = function () {
    var token = localStorage.getItem('token');
    return { Authorization: 'Bearer ' + token };
  };

  var loadProfile = function () {
    axios.get('http://localhost:8080/api/profile', { headers: getAuthHeader() })
      .then(function (res) {
        setName(res.data.name || '');
        setLocation(res.data.preferredLocation || '');
        setLat(res.data.preferredLat || '');
        setLon(res.data.preferredLon || '');
      })
      .catch(function () {
        alert('Failed to load profile');
      });
  };

  useEffect(function () {
    loadProfile();
  }, []);

  var findLocationState = useState(false);
  var findingLocation = findLocationState[0];
  var setFindingLocation = findLocationState[1];

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

  var saveProfile = function () {
    setLoading(true);
    setSaved(false);
    axios.put('http://localhost:8080/api/profile', {
      name: name,
      preferredLocation: location,
      preferredLat: lat === '' ? null : parseFloat(lat),
      preferredLon: lon === '' ? null : parseFloat(lon)
    }, { headers: getAuthHeader() })
      .then(function () {
        setSaved(true);
        setLoading(false);
      })
      .catch(function () {
        alert('Failed to save profile');
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h3>My Profile</h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Name</label>
          <input value={name} onChange={function (e) { setName(e.target.value); }} style={{ padding: 8, width: '100%' }} />
        </div>

                <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Preferred Location</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={location} onChange={function (e) { setLocation(e.target.value); }} style={{ padding: 8, flex: 1 }} placeholder="e.g. Kochi" />
            <button onClick={findLocation} disabled={findingLocation} style={{ padding: '8px 12px' }}>
              {findingLocation ? 'Finding...' : 'Find'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Latitude</label>
            <input value={lat} onChange={function (e) { setLat(e.target.value); }} style={{ padding: 8, width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Longitude</label>
            <input value={lon} onChange={function (e) { setLon(e.target.value); }} style={{ padding: 8, width: '100%' }} />
          </div>
        </div>

        <button onClick={saveProfile} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>

        {saved && <p style={{ color: 'green', marginTop: 10 }}>Profile updated successfully.</p>}
      </div>
    </div>
  );
}

export default Profile;