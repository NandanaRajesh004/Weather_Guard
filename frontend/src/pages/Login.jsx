import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email: email, password: password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <h2 style={{ textAlign: 'center' }}>WeatherGuard Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12 }} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 12 }} required />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <p style={{ textAlign: 'center' }}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;