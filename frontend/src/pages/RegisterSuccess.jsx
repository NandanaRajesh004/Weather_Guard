import { Link } from 'react-router-dom';

function RegisterSuccess() {
  return (
    <div style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center', background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <h2>Registration Successful</h2>
      <p style={{ color: '#555' }}>
        Your account has been created. An administrator will assign your operational role before you can access the admin panel.
      </p>
      <Link to="/" style={{ color: '#0b3d6b', fontWeight: 600 }}>Return to Home</Link>
    </div>
  );
}

export default RegisterSuccess;