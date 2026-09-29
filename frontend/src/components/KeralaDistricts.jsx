import { useState, useEffect } from 'react';
import axios from 'axios';
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

var DISASTER_TYPES = ['FLOOD', 'CYCLONE', 'HEATWAVE'];

function severityRank(level) {
  if (level === 'HIGH') return 3;
  if (level === 'MEDIUM') return 2;
  return 1;
}

function riskColor(level) {
  switch (level) {
    case "SEVERE":
      return "#7f1d1d";
    case "HIGH":
      return "#ef4444";
    case "MODERATE":
      return "#f59e0b";
    case "LOW":
      return "#22c55e";
    default:
      return "#d1d5db";
  }
}

function KeralaDistricts() {
  var resultsState = useState({});
  var results = resultsState[0];
  var setResults = resultsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var selectedState = useState(null);
  var selected = selectedState[0];
  var setSelected = selectedState[1];

  useEffect(function () {
    var allRequests = KERALA_DISTRICTS.map(function (d) {
      var typeRequests = DISASTER_TYPES.map(function (type) {
        return axios.get('http://localhost:8080/api/risk/analyze', {
          params: { location: d.name, lat: d.lat, lon: d.lon, disasterType: type }
        }).then(function (res) { return res.data; }).catch(function () { return null; });
      });
      return Promise.all(typeRequests).then(function (typeResults) {
        var valid = typeResults.filter(function (r) { return r !== null; });
        if (valid.length === 0) return null;
        var worst = valid[0];
        for (var i = 1; i < valid.length; i++) {
          if (severityRank(valid[i].riskLevel) > severityRank(worst.riskLevel)) {
            worst = valid[i];
          }
        }
        return worst;
      });
    });

    Promise.all(allRequests).then(function (combined) {
      var map = {};
      for (var i = 0; i < KERALA_DISTRICTS.length; i++) {
        map[KERALA_DISTRICTS[i].name] = combined[i];
      }
      setResults(map);
      setLoading(false);
    });
  }, []);

  var handleClick = function (districtName) {
    var normalized = districtName;
    var r = results[normalized];
    if (r) {
      setSelected(r);
    }
  };

  return (
    <div style={{ padding: '50px 30px', background: '#eef1f4' }}>
      <h2 style={{ textAlign: 'center' }}>Kerala District Risk Map</h2>
      <p style={{ textAlign: 'center', color: '#555', maxWidth: 600, margin: '0 auto 20px' }}>
        Each district is colored by its most significant current risk. Click a district for details.
      </p>

      {loading && <p style={{ textAlign: 'center' }}>Calculating district risk levels...</p>}

      {!loading && (
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
                      onClick={function () { handleClick(districtName); }}
                      style={{
                        default: { outline: 'none', cursor: 'pointer' },
                        hover: { outline: 'none', cursor: 'pointer', stroke: '#0b3d6b', strokeWidth: 1.2 },
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

      {selected && (
        <div style={{ maxWidth: 350, margin: '20px auto 0', background: 'white', border: '1px solid #d5d9dd', borderRadius: 4, padding: 16 }}>
          <strong>{selected.locationName}</strong><br />
          {selected.disasterType} risk: <span style={{ color: riskColor(selected.riskLevel), fontWeight: 700 }}>{selected.riskLevel}</span><br />
          Temp: {selected.temperature} C, Wind: {selected.windSpeed} km/h, Rain: {selected.precipitation} mm
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 15, fontSize: 13 }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#1b7a3d', marginRight: 5 }}></span>Low</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#b8860b', marginRight: 5 }}></span>Medium</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#b03030', marginRight: 5 }}></span>High</span>
      </div>
    </div>
  );
}

export default KeralaDistricts;