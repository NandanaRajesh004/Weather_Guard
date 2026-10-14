import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Figures printed by ml/train_flood_model.py (5-fold cross-validation)
const BASELINE = '50.8%';
const ACCURACY = '95.8%';
const EARLY_SEASON = [
  { label: 'Jan to Jun', value: '74.5%' },
  { label: 'Jan to Jul', value: '79.6%' },
  { label: 'Jan to Aug', value: '85.5%' }
];
const CUTOFF = 2925;

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cells[i] || '').trim();
    });
    const monsoon = Number(row.JUN) + Number(row.JUL) + Number(row.AUG) + Number(row.SEP);
    return {
      year: Number(row.YEAR),
      annual: Number(row['ANNUAL RAINFALL']),
      monsoon: Math.round(monsoon * 10) / 10,
      flood: row.FLOODS === 'YES'
    };
  });
}

const card = { background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 20, marginTop: 20 };
const labelStyle = { display: 'block', fontSize: 12, marginBottom: 4, color: '#555' };
const cellStyle = { padding: '8px 10px', borderBottom: '1px solid #eee' };

function MlInsights() {
  const [years, setYears] = useState([]);
  const [dataError, setDataError] = useState(false);
  const [annual, setAnnual] = useState('3000');
  const [monsoon, setMonsoon] = useState('2100');
  const [pickedYear, setPickedYear] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState('');

  useEffect(() => {
    axios.get('/kerala_rainfall.csv')
      .then((res) => {
        const rows = parseCsv(String(res.data)).filter(
          (r) => Number.isFinite(r.year) && Number.isFinite(r.annual) && r.annual > 0
        );
        if (rows.length < 50) {
          setDataError(true);
        } else {
          setYears(rows);
        }
      })
      .catch(() => setDataError(true));
  }, []);

  const dataReady = years.length > 0;
  const floodYears = years.filter((y) => y.flood);
  const noFloodYears = years.filter((y) => !y.flood);
  const lowestFlood = floodYears.length ? Math.min(...floodYears.map((y) => y.annual)) : null;
  const highestNoFlood = noFloodYears.length ? Math.max(...noFloodYears.map((y) => y.annual)) : null;

  const pickYear = (value) => {
    setPickedYear(value);
    const row = years.find((y) => String(y.year) === value);
    if (row) {
      setAnnual(String(row.annual));
      setMonsoon(String(row.monsoon));
      setResult(null);
    }
  };

  const runModel = () => {
    setRunning(true);
    setRunError('');
    axios.get('http://localhost:8080/api/ml/flood-outlook', {
      params: { annualRainfall: annual, monsoonRainfall: monsoon }
    })
      .then((res) => {
        setResult(res.data);
        setRunning(false);
      })
      .catch(() => {
        setRunError('Could not reach the model endpoint. Is the backend running, and are both values numbers?');
        setRunning(false);
      });
  };

  const pickedRow = years.find((y) => String(y.year) === pickedYear);
  const output = result ? (result.modelOutput !== undefined ? result.modelOutput : result.floodProbability) : null;
  const outlook = result ? (result.floodYearOutlook || result.outlookLevel) : null;

  return (
    <div>
      <Navbar />

      <div style={{ padding: '30px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <h2>ML Insights</h2>
        <p style={{ color: '#444', lineHeight: 1.6 }}>
          A logistic regression model trained on 118 years of Kerala rainfall (1901-2018). Given a year's annual and
          monsoon (June to September) rainfall, it classifies the year as a flood year or not. It was trained offline
          in Python with scikit-learn (ml/train_flood_model.py), and its learned coefficients run inside the Spring
          Boot backend.
        </p>

        <div style={{ ...card, borderLeft: '6px solid #f59e0b' }}>
          <strong>What this model is and is not</strong>
          <p style={{ margin: '8px 0 0', color: '#444', lineHeight: 1.6 }}>
            It classifies a completed season; it is not a forecast of tomorrow's floods. The flood labels in the
            dataset follow an annual rainfall cut-off close to 2,925 mm, so the model largely learns that cut-off.
            The live district risk scores on the hazard maps come from a separate rule-based engine that explains
            every score. Learning that engine's thresholds from rainfall history is the next planned step.
          </p>
        </div>

        <div style={card}>
          <h3>How well does it work?</h3>
          {dataError && (
            <p style={{ color: '#b03030' }}>
              Could not load the dataset. Copy ml/kerala_rainfall.csv into frontend/public/ and refresh.
            </p>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={cellStyle}>Years in the dataset</td><td style={cellStyle}>{dataReady ? years.length : '-'}</td></tr>
              <tr><td style={cellStyle}>Flood years</td><td style={cellStyle}>{dataReady ? floodYears.length : '-'}</td></tr>
              <tr><td style={cellStyle}>Lowest flood year (annual rainfall)</td><td style={cellStyle}>{dataReady ? lowestFlood + ' mm' : '-'}</td></tr>
              <tr><td style={cellStyle}>Highest no-flood year (annual rainfall)</td><td style={cellStyle}>{dataReady ? highestNoFlood + ' mm' : '-'}</td></tr>
              <tr><td style={cellStyle}>Accuracy of always guessing the most common answer</td><td style={cellStyle}>{BASELINE}</td></tr>
              <tr><td style={cellStyle}>Model accuracy (5-fold cross-validation, years it had not seen)</td><td style={cellStyle}><strong>{ACCURACY}</strong></td></tr>
              <tr><td style={cellStyle}>Mistakes in cross-validation</td><td style={cellStyle}>3 false alarms, 2 missed flood years</td></tr>
            </tbody>
          </table>

          <h4 style={{ marginTop: 20 }}>Forecasting experiment</h4>
          <p style={{ color: '#555', fontSize: 14, margin: '4px 0 8px' }}>
            Using only the rainfall that had fallen by the end of a month (run in the training script, not deployed):
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {EARLY_SEASON.map((e) => (
                <tr key={e.label}><td style={cellStyle}>{e.label}</td><td style={cellStyle}>{e.value}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h3>118 years of rainfall</h3>
          <p style={{ color: '#555', fontSize: 14 }}>
            Each dot is one year. Red dots are flood years and blue dots are years without a flood. The dashed line
            marks the cut-off near 2,925 mm.
          </p>
          {!dataReady && !dataError && <p>Loading dataset...</p>}
          {dataReady && (
            <div style={{ width: '100%', height: 380 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="year" name="Year" domain={[1900, 2020]} allowDecimals={false} />
                  <YAxis type="number" dataKey="annual" name="Annual rainfall" unit=" mm" domain={[1800, 4600]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <ReferenceLine y={CUTOFF} stroke="#555" strokeDasharray="6 4" label="About 2925 mm" />
                  <Scatter name="Flood year" data={floodYears} fill="#ef4444" />
                  <Scatter name="No flood" data={noFloodYears} fill="#0b3d6b" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div style={card}>
          <h3>Try the model</h3>
          <p style={{ color: '#555', fontSize: 14 }}>
            Enter a year's annual and monsoon rainfall, or start from a past year. The request goes to the backend
            endpoint, which runs the trained model.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={labelStyle}>Start from a past year (optional)</label>
              <select value={pickedYear} onChange={(e) => pickYear(e.target.value)} style={{ padding: 8 }}>
                <option value="">Choose a year</option>
                {years.map((y) => (
                  <option key={y.year} value={String(y.year)}>{y.year}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Annual rainfall (mm)</label>
              <input
                value={annual}
                onChange={(e) => { setAnnual(e.target.value); setResult(null); }}
                style={{ padding: 8, width: 130 }}
              />
            </div>
            <div>
              <label style={labelStyle}>Monsoon rainfall, Jun-Sep (mm)</label>
              <input
                value={monsoon}
                onChange={(e) => { setMonsoon(e.target.value); setResult(null); }}
                style={{ padding: 8, width: 130 }}
              />
            </div>
            <button onClick={runModel} disabled={running} style={{ padding: '8px 16px' }}>
              {running ? 'Running...' : 'Run model'}
            </button>
          </div>

          {runError && <p style={{ color: '#b03030', marginTop: 12 }}>{runError}</p>}

          {result && (
            <div style={{ marginTop: 16, background: '#f4f6f9', padding: 16, borderRadius: 4 }}>
              <div>Model output: <strong>{output}</strong> (near 0 means no-flood pattern, near 1 means flood-year pattern)</div>
              <div style={{ marginTop: 6 }}>Outlook: <strong>{outlook}</strong></div>
              {pickedRow && String(pickedRow.annual) === annual && (
                <p style={{ fontSize: 13, color: '#555', marginTop: 10 }}>
                  Recorded label for {pickedRow.year}: <strong>{pickedRow.flood ? 'flood year' : 'no flood'}</strong>.
                  This year was part of the training data, so agreement here is expected. The {ACCURACY} cross-validated
                  figure is the honest estimate for years the model has not seen.
                </p>
              )}
              {result.note && <p style={{ fontSize: 13, color: '#555', marginTop: 10 }}>{result.note}</p>}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MlInsights;