import { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// Indian meteorological subdivisions
const subdivisions = [
  "Andaman & Nicobar Islands", "Arunachal Pradesh", "Assam & Meghalaya", "NMMT", "Bihar",
  "Chhattisgarh", "Coastal Andhra Pradesh", "Coastal Karnataka", "East Madhya Pradesh",
  "East Rajasthan", "East Uttar Pradesh", "Gangetic West Bengal", "Gujarat Region",
  "Haryana Delhi & Chandigarh", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Konkan & Goa", "Lakshadweep", "Madhya Maharashtra",
  "Marathwada", "Nagaland Manipur Mizoram & Tripura", "North Interior Karnataka",
  "Odisha", "Punjab", "Rayalaseema", "Saurashtra & Kutch", "South Interior Karnataka",
  "Sub Himalayan West Bengal & Sikkim", "Tamil Nadu", "Telangana", "Uttarakhand",
  "Vidarbha", "West Madhya Pradesh", "West Rajasthan", "West Uttar Pradesh"
];

// Current weather data simulation
const currentWeather = {
  temperature: 28,
  humidity: 65,
  windSpeed: 12,
  pressure: 1013,
  visibility: 10,
  uvIndex: 6,
  condition: 'partly-cloudy',
  description: 'Partly Cloudy',
  feelsLike: 31,
  dewPoint: 19
};

// Weekly forecast simulation
const weeklyForecast = [
  { day: 'Today', date: 'Dec 15', condition: 'sunny', temp: { high: 32, low: 22 }, humidity: 60, rain: 0, windSpeed: 8 },
  { day: 'Tomorrow', date: 'Dec 16', condition: 'cloudy', temp: { high: 29, low: 20 }, humidity: 70, rain: 0, windSpeed: 12 },
  { day: 'Wed', date: 'Dec 17', condition: 'rainy', temp: { high: 26, low: 18 }, humidity: 85, rain: 15, windSpeed: 15 },
  { day: 'Thu', date: 'Dec 18', condition: 'rainy', temp: { high: 24, low: 17 }, humidity: 90, rain: 25, windSpeed: 18 },
  { day: 'Fri', date: 'Dec 19', condition: 'stormy', temp: { high: 23, low: 16 }, humidity: 95, rain: 45, windSpeed: 25 },
  { day: 'Sat', date: 'Dec 20', condition: 'cloudy', temp: { high: 27, low: 19 }, humidity: 75, rain: 5, windSpeed: 10 },
  { day: 'Sun', date: 'Dec 21', condition: 'sunny', temp: { high: 30, low: 21 }, humidity: 65, rain: 0, windSpeed: 8 }
];

// Hourly forecast simulation
const hourlyForecast = [
  { time: '06:00', temp: 22, condition: 'cloudy', rain: 0, humidity: 75 },
  { time: '09:00', temp: 26, condition: 'sunny', rain: 0, humidity: 68 },
  { time: '12:00', temp: 30, condition: 'sunny', rain: 0, humidity: 55 },
  { time: '15:00', temp: 32, condition: 'partly-cloudy', rain: 0, humidity: 50 },
  { time: '18:00', temp: 28, condition: 'cloudy', rain: 0, humidity: 65 },
  { time: '21:00', temp: 24, condition: 'cloudy', rain: 0, humidity: 70 }
];

// Monthly rainfall simulation data
const monthlyRainfallData = {
  JAN: 15.2, FEB: 12.8, MAR: 18.5, APR: 45.3, MAY: 78.9, JUN: 156.7,
  JUL: 245.8, AUG: 198.4, SEP: 134.2, OCT: 67.8, NOV: 23.1, DEC: 8.9,
  ANNUAL: 1005.6,
  "Jan-Feb": 28.0, "Mar-May": 142.7, "Jun-Sep": 735.1, "Oct-Dec": 99.8
};

// Weather-based farming recommendations
const getWeatherRecommendations = (forecast) => {
  const recommendations = [];
  const nextThreeDays = forecast.slice(0, 3);

  const rainyDays = nextThreeDays.filter(day => day.rain > 10);
  if (rainyDays.length >= 2) {
    recommendations.push({
      type: 'warning',
      category: 'Irrigation',
      title: 'Heavy Rain Expected',
      description: 'Avoid irrigation for the next 3 days. Ensure proper drainage.',
      action: 'Check drainage systems and postpone watering'
    });
  } else if (nextThreeDays.every(day => day.rain === 0)) {
    recommendations.push({
      type: 'info',
      category: 'Irrigation',
      title: 'Dry Period Ahead',
      description: 'No rain expected. Increase irrigation frequency.',
      action: 'Schedule additional watering sessions'
    });
  }

  const highTemp = Math.max(...nextThreeDays.map(day => day.temp.high));
  const lowTemp = Math.min(...nextThreeDays.map(day => day.temp.low));

  if (highTemp > 35) {
    recommendations.push({
      type: 'warning',
      category: 'Heat Protection',
      title: 'Extreme Heat Warning',
      description: 'Protect crops from heat stress. Consider shade nets.',
      action: 'Apply mulching and increase watering frequency'
    });
  }

  if (lowTemp < 10) {
    recommendations.push({
      type: 'warning',
      category: 'Cold Protection',
      title: 'Cold Wave Alert',
      description: 'Protect sensitive crops from cold damage.',
      action: 'Cover crops and avoid early morning watering'
    });
  }

  const highWind = nextThreeDays.some(day => day.windSpeed > 20);
  if (highWind) {
    recommendations.push({
      type: 'warning',
      category: 'Wind Protection',
      title: 'High Wind Alert',
      description: 'Strong winds may damage crops. Secure support structures.',
      action: 'Check and reinforce crop supports'
    });
  }

  const optimalDays = nextThreeDays.filter(day =>
    day.temp.high >= 25 && day.temp.high <= 30 &&
    day.rain === 0 &&
    day.windSpeed < 15
  );

  if (optimalDays.length > 0) {
    recommendations.push({
      type: 'success',
      category: 'Optimal Farming',
      title: 'Perfect Farming Weather',
      description: `${optimalDays.length} day(s) with ideal conditions for field work.`,
      action: 'Schedule fertilizer application and field maintenance'
    });
  }

  return recommendations;
};

// Crop suitability based on weather
const getCropSuitability = (forecast) => {
  const crops = [
    {
      name: 'Rice',
      suitability: forecast.some(day => day.rain > 20) ? 85 : 45,
      reason: forecast.some(day => day.rain > 20) ? 'Excellent for monsoon season' : 'Needs more water',
      recommendation: forecast.some(day => day.rain > 20) ? 'Plant now' : 'Wait for rain'
    },
    {
      name: 'Wheat',
      suitability: forecast.every(day => day.temp.high < 30) ? 90 : 60,
      reason: forecast.every(day => day.temp.high < 30) ? 'Perfect temperature range' : 'Temperature slightly high',
      recommendation: forecast.every(day => day.temp.high < 30) ? 'Ideal for planting' : 'Monitor temperature'
    },
    {
      name: 'Cotton',
      suitability: forecast.some(day => day.temp.high > 30) ? 80 : 55,
      reason: forecast.some(day => day.temp.high > 30) ? 'Good warm weather' : 'Needs warmer conditions',
      recommendation: forecast.some(day => day.temp.high > 30) ? 'Good time to plant' : 'Wait for warmer weather'
    },
    {
      name: 'Sugarcane',
      suitability: forecast.some(day => day.rain > 10) && forecast.some(day => day.temp.high > 28) ? 88 : 65,
      reason: 'Requires high moisture and warm temperature',
      recommendation: 'Monitor water levels closely'
    },
    {
      name: 'Tomato',
      suitability: forecast.every(day => day.temp.high >= 20 && day.temp.high <= 30) ? 85 : 50,
      reason: forecast.every(day => day.temp.high >= 20 && day.temp.high <= 30) ? 'Ideal temperature range' : 'Temperature fluctuation',
      recommendation: 'Use greenhouse if temperature varies'
    }
  ];

  return crops.sort((a, b) => b.suitability - a.suitability);
};

// Weather icon replacement with emojis
const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'sunny': return '☀️';
    case 'cloudy': return '☁️';
    case 'partly-cloudy': return '⛅';
    case 'rainy': return '🌧️';
    case 'stormy': return '⛈️';
    default: return '☀️';
  }
};

export default function Weather() {
  const [recommendations, setRecommendations] = useState([]);
  const [cropSuitability, setCropSuitability] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [activeTab, setActiveTab] = useState('current');
  const [rainfallPredictionForm, setRainfallPredictionForm] = useState({
    subdivision: '',
    year: new Date().getFullYear().toString()
  });
  const [rainfallPredictionResult, setRainfallPredictionResult] = useState(null);

  useEffect(() => {
    setRecommendations(getWeatherRecommendations(weeklyForecast));
    setCropSuitability(getCropSuitability(weeklyForecast));
  }, []);

  const handleRainfallPrediction = () => {
    const variation = (Math.random() - 0.5) * 200;
    const predictedData = {
      ...monthlyRainfallData,
      ANNUAL: monthlyRainfallData.ANNUAL + variation,
      JUL: monthlyRainfallData.JUL + variation * 0.3,
      AUG: monthlyRainfallData.AUG + variation * 0.25,
      SEP: monthlyRainfallData.SEP + variation * 0.2
    };
    setRainfallPredictionResult(predictedData);
  };

  return (
    <div className="min-vh-100" style={{ }}>
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.6s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .card-hover:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
        `}
      </style>
      <div className="container py-4">
        {/* Header */}
        <div className="mb-4 fade-in">
          <div className="d-flex justify-content-between align-items-center">
            <div className='mx-2' >
              <h1 className="display-6 fw-bold">
                <span style={{ background: 'linear-gradient(to right, #2563eb, #16a34a)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                  Agricultural Weather Intelligence
                </span>
              </h1>
              <p className="lead text-muted">
                📍 {selectedLocation} • ML-Powered Weather Analytics for Smart Farming
              </p>
            </div>
            
          </div>
        </div>

        {/* Tabs */}
        {/* <ul className="nav nav-tabs mb-4">
          {['current', 'forecast', 'rainfall-prediction', 'recommendations', 'crops', 'alerts'].map(tab => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            </li>
          ))}
        </ul> */}
        <div className="d-flex justify-content-center m-2 mb-4">
          <div className="d-flex bg-light rounded-3 shadow-sm w-100" style={{}}>
            {['current', 'forecast', 'rainfall-prediction', 'recommendations', 'crops', 'alerts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-fill btn border-0 fw-semibold py-2 ${
                  activeTab === tab
                    ? "bg-white text-success shadow-sm rounded-3"
                    : "text-muted"
                }`}
              >
               {tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Current Weather Tab */}
        {activeTab === 'current' && (
          <div className="fade-in">
            <div className="row g-4 mx-0">
              {/* Main Weather Card */}
              <div className="col-lg-8">
                <div className="card card-hover" style={{  color: 'black',height:"330px" }}>
                  <div className="ms-2" >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h2 className="card-title display-4">{currentWeather.temperature}°C</h2>
                        <p className="card-text fs-5">{currentWeather.description}</p>
                        <p className="text-black fw-bold">Feels like {currentWeather.feelsLike}°C</p>
                      </div>
                      <div className="fs-1">{getWeatherIcon(currentWeather.condition)}</div>
                    </div>
                    <div className="row">
                      {[
                        { label: 'Humidity', value: `${currentWeather.humidity}%`, icon: '💧' },
                        { label: 'Wind Speed', value: `${currentWeather.windSpeed} km/h`, icon: '🌬️' },
                        { label: 'Visibility', value: `${currentWeather.visibility} km`, icon: '👁️' },
                        { label: 'Pressure', value: `${currentWeather.pressure} hPa`, icon: '📏' },
                        { label: 'UV Index', value: currentWeather.uvIndex, icon: '☀️' },
                        { label: 'Dew Point', value: `${currentWeather.dewPoint}°C`, icon: '🌡️' }
                      ].map((item, index) => (
                        <div className="col-md-4 mb-3" key={index}>
                          <p className="text-black fw-bold mb-1">{item.icon} {item.label}</p>
                          <p className="fw-bold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="col-lg-4">
                <div className="card card-hover">
                  <div className="card-body">
                    <h3 className="card-title">⏰ Today's Hourly</h3>
                    <div className="mt-3">
                      {hourlyForecast.map((hour, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <span>{hour.time}</span>
                          <div className="d-flex align-items-center gap-2">
                            <span>{getWeatherIcon(hour.condition)}</span>
                            <span>{hour.temp}°</span>
                            <span className="text-muted">{hour.humidity}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Conditions for Farming */}
            <div className="card card-hover mt-4 mx-2">
              <div className="card-body p-0">
                <h3 className="card-title">🌱 Current Farming Conditions</h3>
                <p className="card-text text-muted">Real-time assessment for agricultural activities</p>
                <div className="row mt-4">
                  {[
                    { title: 'Planting Conditions', status: 'Excellent', description: 'Ideal soil moisture and temperature for most crops', icon: '🌿' },
                    { title: 'Irrigation Need', status: 'Moderate', description: 'Consider light watering in the evening', icon: '💧' },
                    { title: 'Field Work', status: 'Good', description: 'Suitable for most field operations', icon: '⚡' }
                  ].map((item, index) => (
                    <div className="col-md-4 text-center mb-4" key={index}>
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                        <span className="fs-3">{item.icon}</span>
                      </div>
                      <h4 className="fw-bold">{item.title}</h4>
                      <span className={`badge ${item.status === 'Excellent' ? 'bg-success' : item.status === 'Moderate' ? 'bg-warning' : 'bg-info'}`}>
                        {item.status}
                      </span>
                      <p className="text-muted mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="card card-hover fade-in">
            <div className="card-body">
              <h3 className="card-title">📅 7-Day Agricultural Forecast</h3>
              <p className="card-text text-muted">Detailed weather predictions for farming planning</p>
              <div className="mt-4">
                {weeklyForecast.map((day, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded-3 mb-2 card-hover">
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-center" style={{ minWidth: '80px' }}>
                        <p className="fw-medium">{day.day}</p>
                        <p className="text-muted small">{day.date}</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span>{getWeatherIcon(day.condition)}</span>
                        <div>
                          <p className="fw-medium text-capitalize">{day.condition.replace('-', ' ')}</p>
                          <p className="text-muted small">H: {day.temp.high}° L: {day.temp.low}°</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-4 text-center">
                      <div>
                        <p className="text-muted small">Rain</p>
                        <p className="fw-medium">🌧️ {day.rain}mm</p>
                      </div>
                      <div>
                        <p className="text-muted small">Humidity</p>
                        <p className="fw-medium">💧 {day.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-muted small">Wind</p>
                        <p className="fw-medium">🌬️ {day.windSpeed} km/h</p>
                      </div>
                    </div>
                    <div>
                      {day.rain > 20 ? (
                        <span className="badge bg-primary">Heavy Rain</span>
                      ) : day.temp.high > 35 ? (
                        <span className="badge bg-danger">Hot</span>
                      ) : day.rain === 0 && day.temp.high < 30 ? (
                        <span className="badge bg-success">Ideal</span>
                      ) : (
                        <span className="badge bg-secondary">Normal</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rainfall Prediction Tab */}
        {activeTab === 'rainfall-prediction' && (
          <div className="row g-4 fade-in">
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body">
                  <h3 className="card-title">📊 Rainfall Prediction Dataset</h3>
                  <p className="card-text text-muted">Input subdivision and year for detailed rainfall predictions</p>
                  <div className="mb-3">
                    <label htmlFor="subdivision" className="form-label">Subdivision</label>
                    <select
                      className="form-select"
                      value={rainfallPredictionForm.subdivision}
                      onChange={(e) => setRainfallPredictionForm(prev => ({ ...prev, subdivision: e.target.value }))}
                    >
                      <option value="">Select meteorological subdivision</option>
                      {subdivisions.map((subdivision) => (
                        <option key={subdivision} value={subdivision}>{subdivision}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="year" className="form-label">Year</label>
                    <input
                      type="number"
                      className="form-control"
                      min="2020"
                      max="2030"
                      value={rainfallPredictionForm.year}
                      onChange={(e) => setRainfallPredictionForm(prev => ({ ...prev, year: e.target.value }))}
                    />
                  </div>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleRainfallPrediction}
                    disabled={!rainfallPredictionForm.subdivision || !rainfallPredictionForm.year}
                  >
                    🧠 Predict Rainfall
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body">
                  <h3 className="card-title">📈 Rainfall Prediction Results</h3>
                  {rainfallPredictionResult ? (
                    <div>
                      <div className="alert alert-primary">
                        <div className="fw-bold">🌧️ Annual Rainfall Prediction: {rainfallPredictionResult.ANNUAL.toFixed(1)}mm</div>
                        <p className="small">For {rainfallPredictionForm.subdivision} in {rainfallPredictionForm.year}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="fw-bold">Monthly Breakdown (mm)</h4>
                        <div className="row g-2">
                          {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                            <div key={month} className="col-4">
                              <div className="p-2 bg-light rounded">
                                <span className="fw-medium">{month}</span>: {rainfallPredictionResult[month].toFixed(1)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="fw-bold">Seasonal Breakdown (mm)</h4>
                        <div className="row g-2">
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <span className="fw-medium">Winter (Jan-Feb)</span>: {rainfallPredictionResult["Jan-Feb"].toFixed(1)}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <span className="fw-medium">Pre-Monsoon (Mar-May)</span>: {rainfallPredictionResult["Mar-May"].toFixed(1)}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <span className="fw-medium">Monsoon (Jun-Sep)</span>: {rainfallPredictionResult["Jun-Sep"].toFixed(1)}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <span className="fw-medium">Post-Monsoon (Oct-Dec)</span>: {rainfallPredictionResult["Oct-Dec"].toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <p>📊 Select subdivision and year to get rainfall predictions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farm Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="row g-4 fade-in">
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body p-0">
                  <h3 className="card-title">🧠 AI Weather Recommendations</h3>
                  <p className="card-text text-muted">Smart farming advice based on weather patterns</p>
                  <div className="mt-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`alert ${rec.type === 'warning' ? 'alert-danger' : rec.type === 'success' ? 'alert-success' : 'alert-info'} mb-3`}>
                        <div className="d-flex align-items-start">
                          <span className="me-2">{rec.type === 'warning' ? '⚠️' : rec.type === 'success' ? '✅' : '💡'}</span>
                          <div>
                            <div className="d-flex justify-content-between">
                              <h4 className="fw-bold">{rec.title}</h4>
                              <span className="badge bg-white text-dark" style={{width:'120px',marginTop:'10px'}} >{rec.category}</span>
                            </div>
                            <p>{rec.description}</p>
                            <p className="small bg-light p-1 rounded">Action: {rec.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body  p-0">
                  <h3 className="card-title">💧 Smart Irrigation Schedule</h3>
                  <p className="card-text text-muted">Optimized watering plan based on weather forecast</p>
                  <div className="mt-4">
                    {weeklyForecast.slice(0, 5).map((day, index) => {
                      const needsIrrigation = day.rain < 5;
                      const irrigationLevel = day.rain === 0 ? 'High' : day.rain < 10 ? 'Medium' : 'Low';
                      return (
                        <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                          <div className="d-flex align-items-center gap-3">
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <p className="fw-medium small">{day.day}</p>
                              <p className="text-muted small">{day.date}</p>
                            </div>
                            <span>{getWeatherIcon(day.condition)}</span>
                            <div>
                              <p className="small">{day.temp.high}°/{day.temp.low}°</p>
                              <p className="text-muted small">{day.rain}mm rain</p>
                            </div>
                          </div>
                          <div className="text-end">
                            {needsIrrigation ? (
                              <div>
                                <span className={`badge ${irrigationLevel === 'High' ? 'bg-danger' : irrigationLevel === 'Medium' ? 'bg-warning' : 'bg-primary'}`}>
                                  {irrigationLevel} Need
                                </span>
                                <p className="text-muted small mt-1">
                                  {irrigationLevel === 'High' ? '2-3 hours' : 
                                   irrigationLevel === 'Medium' ? '1-2 hours' : '30-60 min'}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <span className="badge bg-secondary">Skip</span>
                                <p className="text-muted small mt-1">Natural rain</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 p-3 bg-light rounded">
                      <h4 className="fw-bold">💡 Irrigation Tips</h4>
                      <ul className="list-unstyled small">
                        <li>• Water early morning (5-7 AM) or evening (6-8 PM)</li>
                        <li>• Avoid watering during heavy rain forecast</li>
                        <li>• Increase frequency during hot, dry periods</li>
                        <li>• Check soil moisture before watering</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crop Suitability Tab */}
        {activeTab === 'crops' && (
          <div className="card card-hover fade-in">
            <div className="card-body p-0">
              <h3 className="card-title">🎯 Weather-Based Crop Suitability</h3>
              <p className="card-text text-muted">Best crops to grow based on current and forecasted weather conditions</p>
              <div className="row g-3 mt-2">
                {cropSuitability.map((crop, index) => (
                  <div key={index} className="col-md-4">
                    <div className="border rounded p-3 card-hover">
                      <div className="d-flex justify-content-between mb-2">
                        <h4 className="fw-bold">{crop.name}</h4>
                        <span className={`badge ${crop.suitability >= 80 ? 'bg-success' : crop.suitability >= 60 ? 'bg-warning' : 'bg-danger'} mt-3`}>
                          {crop.suitability}%
                        </span>
                      </div>
                      <div>
                        <p className="text-muted small mb-1">Suitability Score</p>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${crop.suitability}%`, backgroundColor: crop.suitability >= 80 ? '#28a745' : crop.suitability >= 60 ? '#ffc107' : '#dc3545',}}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="fw-medium small mb-0">Weather Analysis:</p>
                        <p className="text-muted small">{crop.reason}</p>
                      </div>
                      <div className="mt-2 pt-1 border-top">
                        <p className="fw-medium small text-success mb-0">Recommendation:</p>
                        <p className="">{crop.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Weather Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="row g-4 fade-in">
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body p-0">
                  <h3 className="card-title">⚠️ Active Weather Alerts</h3>
                  <div className="mt-4">
                    <div className="alert alert-danger">
                      <div className="fw-bold">🌧️ Heavy Rainfall Warning</div>
                      <p className="small">Expected 25-45mm rainfall on Dec 19. Ensure proper drainage and avoid field operations.</p>
                      <p className="small text-muted">Valid until: Dec 20, 6:00 AM</p>
                    </div>
                    <div className="alert alert-warning">
                      <div className="fw-bold">🌬️ High Wind Advisory</div>
                      <p className="small">Wind speeds up to 25 km/h expected. Secure loose structures and support tall crops.</p>
                      <p className="small text-muted">Valid until: Dec 19, 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card card-hover">
                <div className="card-body p-0">
                  <h3 className="card-title">📈 Dataset Statistics</h3>
                  <div className="row g-3 mt-4">
                    {[
                      { label: 'Subdivisions', value: '38', description: 'Meteorological regions', color: 'primary' },
                      { label: 'Years', value: '117+', description: 'Historical data', color: 'success' },
                      { label: 'Accuracy', value: '91.5%', description: 'Prediction accuracy', color: 'info' },
                      { label: 'Data Points', value: '15K+', description: 'Monthly records', color: 'warning' }
                    ].map((stat, index) => (
                      <div key={index} className="col-6">
                        <div className={`p-3 bg-${stat.color}-subtle rounded`}>
                          <p className="fw-medium">{stat.label}</p>
                          <p className={`fs-4 fw-bold text-${stat.color}`}>{stat.value}</p>
                          <p className={`text-${stat.color} small`}>{stat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}