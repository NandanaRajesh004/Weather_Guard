import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  var nameState = useState('');
  var name = nameState[0];
  var setName = nameState[1];

  var emailState = useState('');
  var email = emailState[0];
  var setEmail = emailState[1];

  var messageState = useState('');
  var message = messageState[0];
  var setMessage = messageState[1];

  var sentState = useState(false);
  var sent = sentState[0];
  var setSent = sentState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var handleSubmit = function (e) {
    e.preventDefault();
    setLoading(true);
    axios.post('http://localhost:8080/api/contact', {
      name: name,
      email: email,
      message: message
    }).then(function () {
      setSent(true);
      setLoading(false);
      setName('');
      setEmail('');
      setMessage('');
    }).catch(function () {
      alert('Failed to send message');
      setLoading(false);
    });
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: 600, margin: '50px auto', background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 30 }}>
        <h2>Contact Us</h2>
        <p style={{ color: '#555', marginBottom: 20 }}>Have a question or feedback? Send us a message.</p>

        {sent && <p style={{ color: '#1b7a3d', fontWeight: 600 }}>Your message has been sent. Thank you.</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Name</label>
            <input value={name} onChange={function (e) { setName(e.target.value); }} style={{ padding: 8, width: '100%' }} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Email</label>
            <input type="email" value={email} onChange={function (e) { setEmail(e.target.value); }} style={{ padding: 8, width: '100%' }} required />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: '#555' }}>Message</label>
            <textarea value={message} onChange={function (e) { setMessage(e.target.value); }} rows={5} style={{ padding: 8, width: '100%', fontFamily: 'inherit', border: '1px solid #a0a8b0', borderRadius: 3 }} required></textarea>
          </div>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className="gov-footer">
        <p>&copy; 2026 WeatherGuard. A student initiative for disaster preparedness.</p>
      </div>
    </div>
  );
}

export default Contact;