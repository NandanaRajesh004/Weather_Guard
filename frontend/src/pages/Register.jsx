import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      maxWidth: 400, margin: '80px auto', background: 'white', padding: 30,
      borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ textAlign: 'center' }}>WeatherGuard Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }} required />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Register</button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <p style={{ textAlign: 'center' }}>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
}

export default Register;