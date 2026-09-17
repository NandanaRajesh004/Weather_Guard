import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Admin() {
  var usersState = useState([]);
  var users = usersState[0];
  var setUsers = usersState[1];

  var alertsState = useState([]);
  var alerts = alertsState[0];
  var setAlerts = alertsState[1];

  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  var navigate = useNavigate();

  var getAuthHeader = function () {
    var token = localStorage.getItem('token');
    return { Authorization: 'Bearer ' + token };
  };

  var handleLogout = function () {
    localStorage.removeItem('token');
    navigate('/');
  };

  var loadData = function () {
    axios.get('http://localhost:8080/api/admin/users', { headers: getAuthHeader() })
      .then(function (res) { setUsers(res.data); })
      .catch(function () { setError('Access denied or session expired. Please log in as an admin.'); });

    axios.get('http://localhost:8080/api/admin/alerts', { headers: getAuthHeader() })
      .then(function (res) { setAlerts(res.data); })
      .catch(function () {});
  };

  useEffect(function () {
    loadData();
  }, []);

  var deleteAlert = function (id) {
    axios.delete('http://localhost:8080/api/admin/alerts/' + id, { headers: getAuthHeader() })
      .then(function () { loadData(); })
      .catch(function () { alert('Failed to delete alert'); });
  };

  return (
    <div>
      <div className="gov-header">
        <div className="gov-header-top">
          <div style={{ fontSize: 26 }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>WEATHERGUARD ADMIN</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Administration Panel</div>
          </div>
          <Link to="/" style={{ padding: '8px 16px', background: 'white', color: '#0b3d6b', borderRadius: 3, textDecoration: 'none', fontWeight: 600, fontSize: 14, marginRight: 10 }}>Home</Link>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'white', color: '#0b3d6b' }}>Logout</button>
        </div>
        <div className="gov-header-stripe"></div>
      </div>

     <div style={{ padding: '30px 40px', maxWidth: 1000, margin: '0 auto' }}>
        {error && (
          <div style={{ background: '#fdecea', border: '1px solid #b03030', color: '#b03030', padding: 15, borderRadius: 4, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div style={{ background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, marginBottom: 20 }}>
          <h3>Registered Users ({users.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d5d9dd', textAlign: 'left' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Email</th>
                <th style={{ padding: 8 }}>Role</th>
                <th style={{ padding: 8 }}>Preferred Location</th>
              </tr>
            </thead>
            <tbody>
              {users.map(function (u) {
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{u.name}</td>
                    <td style={{ padding: 8 }}>{u.email}</td>
                    <td style={{ padding: 8 }}>{u.role}</td>
                    <td style={{ padding: 8 }}>{u.preferredLocation || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 20 }}>
          <h3>All Alerts ({alerts.length})</h3>
          {alerts.map(function (a) {
            return (
              <div key={a.id} style={{ borderLeft: '4px solid #b03030', background: '#f9f9f9', padding: 12, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{a.locationName} - {a.disasterType} ({a.riskLevel})</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>{a.message}</p>
                </div>
                <button onClick={function () { deleteAlert(a.id); }} style={{ background: '#b03030', padding: '6px 12px' }}>Delete</button>
              </div>
            );
          })}
        </div>
    </div>
      <Footer />
    </div>
  );
}

export default Admin;