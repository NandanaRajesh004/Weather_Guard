import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import Dashboard from './pages/Dashboard';
import Guidelines from './pages/Guidelines';
import RiskAlerts from './pages/RiskAlerts';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import MapPage from './pages/MapPage';
import MlInsights from './pages/MlInsights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/risk-alerts" element={<RiskAlerts />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/map/:hazard" element={<MapPage />} />
        <Route path="/ml-insights" element={<MlInsights />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;