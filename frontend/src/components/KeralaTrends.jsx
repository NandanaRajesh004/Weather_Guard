import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

var RANGES = [
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' }
];

var METRICS = [
  { key: 'avgTemperature', label: 'Temperature', unit: 'C', color: '#ef4444' },
  { key: 'avgHumidity', label: 'Humidity', unit: '%', color: '#0b3d6b' },
  { key: 'avgWindSpeed', label: 'Wind speed', unit: 'km/h', color: '#22c55e' },
  { key: 'avgRainToday', label: 'Rain forecast for the day', unit: 'mm', color: '#6366f1' }
];

function toggleStyle(active) {
  return {
    padding: '6px 14px',
    background: active ? '#0b3d6b' : 'white',
    color: active ? 'white' : '#0b3d6b',
    border: '1px solid #0b3d6b'
  };
}

function KeralaTrends() {
  var rangeState = useState('7d');
  var range = rangeState[0];
  var setRange = rangeState[1];

  var metricState = useState('avgTemperature');
  var metricKey = metricState[0];
  var setMetricKey = metricState[1];

  var dataState = useState([]);
  var data = dataState[0];
  var setData = dataState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState(false);
  var error = errorState[0];
  var setError = errorState[1];

  useEffect(function () {
    var cancelled = false;
    setLoading(true);
    setError(false);
    axios.get('http://localhost:8080/api/weather/kerala-trend', { params: { range: range } })
      .then(function (res) {
        if (cancelled) return;
        setData(res.data);
        setLoading(false);
      })
      .catch(function () {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return function () { cancelled = true; };
  }, [range]);

  var metric = METRICS.filter(function (m) { return m.key === metricKey; })[0];

  var points = data.map(function (p) {
    var d = new Date(p.bucket);
    var label = range === '24h'
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { day: 'numeric', month: 'short' });
    return Object.assign({}, p, { label: label });
  });

  return (
    <div style={{ padding: '50px 30px', background: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>Kerala Weather Trends</h2>
      <p style={{ textAlign: 'center', color: '#555', maxWidth: 600, margin: '0 auto 20px' }}>
        Average across the 14 districts, built from the readings the system has recorded.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {RANGES.map(function (r) {
          return (
            <button key={r.key} onClick={function () { setRange(r.key); }} style={toggleStyle(range === r.key)}>
              {r.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {METRICS.map(function (m) {
          return (
            <button key={m.key} onClick={function () { setMetricKey(m.key); }} style={toggleStyle(metricKey === m.key)}>
              {m.label}
            </button>
          );
        })}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading trend...</p>}
      {error && <p style={{ textAlign: 'center', color: '#b03030' }}>Could not load trend data. Is the backend running?</p>}

      {!loading && !error && points.length === 0 && (
        <p style={{ textAlign: 'center', color: '#777' }}>
          Not enough readings in this period yet. Opening a hazard map records fresh readings for every district.
        </p>
      )}

      {!loading && !error && points.length > 0 && (
        <div style={{ maxWidth: 800, margin: '0 auto', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip
                formatter={function (value) { return [value + ' ' + metric.unit, metric.label]; }}
                labelFormatter={function (label, payload) {
                  if (payload && payload.length > 0) {
                    return label + ' (' + payload[0].payload.districts + ' of 14 districts)';
                  }
                  return label;
                }}
              />
              <Line type="monotone" dataKey={metric.key} stroke={metric.color} strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default KeralaTrends;