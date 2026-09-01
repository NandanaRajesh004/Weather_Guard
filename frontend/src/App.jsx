import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Guidelines from './pages/Guidelines';
import RiskAlerts from './pages/RiskAlerts';
import Trends from './pages/Trends';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/risk-alerts" element={<RiskAlerts />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;