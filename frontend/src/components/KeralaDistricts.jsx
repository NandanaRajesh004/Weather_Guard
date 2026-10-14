import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

var GEO_URL = 'https://raw.githubusercontent.com/geohacker/kerala/master/geojsons/district.geojson';

var KERALA_DISTRICTS = [
  { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
  { name: 'Kollam', lat: 8.8932, lon: 76.6141 },
  { name: 'Pathanamthitta', lat: 9.2648, lon: 76.7870 },
  { name: 'Alappuzha', lat: 9.4981, lon: 76.3388 },
  { name: 'Kottayam', lat: 9.5916, lon: 76.5222 },
  { name: 'Idukki', lat: 9.8497, lon: 76.9681 },
  { name: 'Ernakulam', lat: 9.9816, lon: 76.2999 },
  { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
  { name: 'Palakkad', lat: 10.7867, lon: 76.6548 },
  { name: 'Malappuram', lat: 11.0510, lon: 76.0711 },
  { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
  { name: 'Wayanad', lat: 11.6854, lon: 76.1320 },
  { name: 'Kannur', lat: 11.8745, lon: 75.3704 },
  { name: 'Kasaragod', lat: 12.4996, lon: 74.9869 }
];

var HAZARDS = ['FLOOD', 'CYCLONE', 'HEATWAVE', 'LIGHTNING'];

function hazardLabel(h) {
  if (h === 'FLOOD') return 'Flood';
  if (h === 'CYCLONE') return 'Cyclone / Wind';
  if (h === 'HEATWAVE') return 'Heatwave';
  return 'Lightning';
}

function riskColor(level) {
  switch (level) {
    case 'SEVERE': return '#7f1d1d';
    case 'HIGH': return '#ef4444';
    case 'MODERATE': return '#f59e0b';
    case 'LOW': return '#22c55e';
    default: return '#d1d5db';
  }
}

function KeralaDistricts(props) {
  // When a hazard is passed in (map pages), the parent controls it.
  // Without one (landing page), the component shows its own toggle buttons.
  var hazardState = useState('FLOOD');
  var localHazard = hazardState[0];
  var setLocalHazard = hazardState[1];
  var hazard = props.hazard || localHazard;
  var showToggle = !props.hazard;

  var resultsState = useState({});
  var results = resultsState[0];
  var setResults = resultsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var selectedState = useState(null);
  var selected = selectedState[0];
  var setSelected = selectedState[1];

  var tooltipState = useState(null);
  var tooltip = tooltipState[0];
  var setTooltip = tooltipState[1];

  useEffect(function () {
    var cancelled = false;
    setLoading(true);
    setSelected(null);

    var requests = KERALA_DISTRICTS.map(function (d) {
      return axios.get('http://localhost:8080/api/risk/analyze', {
        params: { location: d.name, lat: d.lat, lon: d.lon, disasterType: hazard }
      }).then(function (res) { return res.data; }).catch(function () { return null; });
    });

    Promise.all(requests).then(function (combined) {
      if (cancelled) return;
      var map = {};
      for (var i = 0; i < KERALA_DISTRICTS.length; i++) {
        map[KERALA_DISTRICTS[i].name] = combined[i];
      }
      setResults(map);
      setLoading(false);
    });

    return function () { cancelled = true; };
  }, [hazard]);

  var anyData = KERALA_DISTRICTS.some(function (d) { return results[d.name]; });

  var showTooltip = function (evt, districtName) {
    setTooltip({ x: evt.clientX, y: evt.clientY, name: districtName, data: results[districtName] });
  };

  var legendItem = function (color, label) {
    return (
      <span>
        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color, marginRight: 5 }}></span>
        {label}
      </span>
    );
  };

  return (
    <div style={{ padding: '30px 30px 50px', background: '#eef1f4' }}>
      <h2 style={{ textAlign: 'center' }}>{hazardLabel(hazard)} Risk Map - Kerala</h2>
      <p style={{ textAlign: 'center', color: '#555', maxWidth: 600, margin: '0 auto 20px' }}>
        Hover over a district to see its risk level. Click it for the full explanation.
      </p>

      {showToggle && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {HAZARDS.map(function (h) {
            var isActive = hazard === h;
            return (
              <button
                key={h}
                onClick={function () { setLocalHazard(h); }}
                style={{
                  padding: '8px 16px',
                  background: isActive ? '#0b3d6b' : 'white',
                  color: isActive ? 'white' : '#0b3d6b',
                  border: '1px solid #0b3d6b'
                }}
              >
                {hazardLabel(h)}
              </button>
            );
          })}
        </div>
      )}

      {loading && <p style={{ textAlign: 'center' }}>Calculating district risk levels...</p>}

      {!loading && !anyData && (
        <p style={{ textAlign: 'center', color: '#b03030' }}>Could not load risk data. Is the backend running?</p>
      )}

      {!loading && anyData && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [76.4, 10.5], scale: 6000 }}
            width={500}
            height={650}
          >
            <Geographies geography={GEO_URL}>
              {function (geoProps) {
                return geoProps.geographies.map(function (geo) {
                  var districtName = geo.properties.DISTRICT;
                  var r = results[districtName];
                  var fill = r ? riskColor(r.riskLevel) : '#c7ccd1';
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      onMouseEnter={function (evt) { showTooltip(evt, districtName); }}
                      onMouseMove={function (evt) { showTooltip(evt, districtName); }}
                      onMouseLeave={function () { setTooltip(null); }}
                      onClick={function () { if (r) setSelected(r); }}
                      style={{
                        default: { outline: 'none', cursor: 'pointer' },
                        hover: { outline: 'none', cursor: 'pointer', stroke: '#0b3d6b', strokeWidth: 1.5 },
                        pressed: { outline: 'none' }
                      }}
                    />
                  );
                });
              }}
            </Geographies>
          </ComposableMap>
        </div>
      )}

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y + 14,
            background: 'white',
            border: '1px solid #d5d9dd',
            borderRadius: 4,
            padding: '8px 12px',
            fontSize: 13,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            zIndex: 50
          }}
        >
          <strong>{tooltip.name}</strong>
          <br />
          {tooltip.data ? tooltip.data.riskLevel + ' (' + tooltip.data.riskScore + '/100)' : 'No data'}
        </div>
      )}

      {selected && (
        <div style={{ maxWidth: 420, margin: '20px auto 0', background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 16 }}>
          <strong>{selected.locationName}</strong>
          <br />
          <span style={{ color: riskColor(selected.riskLevel), fontWeight: 700 }}>{selected.riskLevel}</span>
          {' '}({selected.riskScore}/100)
          {selected.explanation && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>{selected.explanation}</div>
          )}
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Temp: {selected.temperature} C, Wind: {selected.windSpeed} km/h, Rain now: {selected.precipitation} mm
          </div>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            <Link to="/guidelines" style={{ color: '#0b3d6b', fontWeight: 600 }}>See safety guidance</Link>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 15, fontSize: 13, flexWrap: 'wrap' }}>
        {legendItem('#22c55e', 'Low')}
        {legendItem('#f59e0b', 'Moderate')}
        {legendItem('#ef4444', 'High')}
        {legendItem('#7f1d1d', 'Severe')}
        {legendItem('#c7ccd1', 'No data')}
      </div>
    </div>
  );
}

export default KeralaDistricts;