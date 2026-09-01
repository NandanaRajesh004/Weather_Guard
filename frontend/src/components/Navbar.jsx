import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkStyle = {
    color: 'white', textDecoration: 'none', marginRight: 20, fontWeight: 500
  };

  return (
    <div style={{
      background: '#1e3c72', padding: '14px 30px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center', borderRadius: '12px 12px 0 0'
    }}>
      <div>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 18, marginRight: 30 }}>WeatherGuard</span>
        <Link to="/dashboard" style={linkStyle}>Weather</Link>
        <Link to="/guidelines" style={linkStyle}>Guidelines</Link>
      </div>
      <button onClick={handleLogout} style={{ padding: '6px 14px' }}>Logout</button>
    </div>
  );
}

export default Navbar;