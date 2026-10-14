import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import KeralaDistricts from '../components/KeralaDistricts';

var HAZARDS = [
  { key: 'flood', label: 'Flood' },
  { key: 'cyclone', label: 'Cyclone / Wind' },
  { key: 'heatwave', label: 'Heatwave' },
  { key: 'lightning', label: 'Lightning' }
];

function MapPage() {
  var params = useParams();
  var current = (params.hazard || '').toLowerCase();

  var valid = HAZARDS.some(function (h) { return h.key === current; });
  if (!valid) {
    return <Navigate to="/map/flood" replace />;
  }

  return (
    <div>
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', padding: '24px 30px 0', background: '#eef1f4' }}>
        {HAZARDS.map(function (h) {
          var isActive = h.key === current;
          return (
            <Link
              key={h.key}
              to={'/map/' + h.key}
              style={{
                padding: '8px 16px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 14,
                border: '1px solid #0b3d6b',
                background: isActive ? '#0b3d6b' : 'white',
                color: isActive ? 'white' : '#0b3d6b'
              }}
            >
              {h.label}
            </Link>
          );
        })}
      </div>

      <KeralaDistricts hazard={current.toUpperCase()} />
      <Footer />
    </div>
  );
}

export default MapPage;