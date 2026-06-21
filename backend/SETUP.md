# CoolZone Backend Setup Guide

## 📋 Quick Setup

### Step 1: Get OpenWeatherMap API Key (FREE!)

1. Go to: https://openweathermap.org/api
2. Click **"Sign Up"** (it's FREE!)
3. Verify your email
4. Go to **"API Keys"** tab
5. Copy your API Key

### Step 2: Create .env file

```bash
cd backend
copy .env.example .env
```

Then open `.env` and paste your API key:

```bash
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run Backend Server

```bash
python app.py
```

You should see:
```
==================================================
🌡️  CoolZone Backend API
==================================================
📍 Running on: http://localhost:5000
🔧 Debug mode: True
🔑 API Key configured: True
==================================================
```

---

## 🧪 Test the API

### Test 1: Health Check

```bash
# Open browser:
http://localhost:5000/api/health
```

Expected:
```json
{
  "status": "ok",
  "message": "Weather API is running",
  "api_configured": true
}
```

### Test 2: Get Weather (Bangkok)

```bash
http://localhost:5000/api/weather?lat=13.7563&lng=100.5018
```

Expected:
```json
{
  "status": "success",
  "data": {
    "location": {
      "lat": 13.7563,
      "lng": 100.5018,
      "name": "Bangkok"
    },
    "weather": {
      "temperature": 32.5,
      "humidity": 70,
      "description": "ท้องฟ้าแจ่มใส",
      ...
    },
    "heat_index": 39.2,
    "risk_level": "MEDIUM",
    "risk_info": {
      "message": "ระวัง - ควรจำกัดกิจกรรมกลางแจ้ง",
      "recommendations": [...]
    }
  }
}
```

### Test 3: Get Forecast

```bash
http://localhost:5000/api/forecast?lat=13.7563&lng=100.5018&hours=6
```

---

## 📁 Backend Structure

```
backend/
├── app.py                   # Main Flask app
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (YOU CREATE THIS!)
├── .env.example            # Template
│
├── api/
│   └── routes/
│       └── weather.py      # Weather API endpoints
│
├── services/
│   └── weather_service.py  # OpenWeatherMap integration
│
└── models/
    └── heat.py             # Heat Index calculator (NOAA formula)
```

---

## 🔑 API Endpoints

### 1. GET /api/weather

**Get current weather + heat risk**

Query Parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude
- `profile` (optional): 'general', 'elderly', 'outdoor_worker'

Example:
```
/api/weather?lat=13.7563&lng=100.5018&profile=general
```

### 2. GET /api/forecast

**Get 6-hour forecast + heat risk**

Query Parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude
- `hours` (optional): Number of hours (default: 6)
- `profile` (optional): User profile

Example:
```
/api/forecast?lat=13.7563&lng=100.5018&hours=6
```

### 3. GET /api/health

**Health check**

Returns API status

---

## 🧮 Heat Index Formula (NOAA)

The backend uses the official NOAA Heat Index formula:

```python
HI = -42.379 + 2.04901523*T + 10.14333127*RH 
     - 0.22475541*T*RH - 0.00683783*T² 
     - 0.05481717*RH² + 0.00122874*T²*RH 
     + 0.00085282*T*RH² - 0.00000199*T²*RH²
```

### Risk Classification:

| Profile | Low | Medium | High |
|---------|-----|--------|------|
| General | <32°C | 32-40°C | >40°C |
| Elderly | <28°C | 28-35°C | >35°C |
| Worker | <30°C | 30-38°C | >38°C |

---

## 🐛 Troubleshooting

### Error: "OPENWEATHER_API_KEY not found"

**Solution**: Create `.env` file with your API key

```bash
cd backend
copy .env.example .env
# Edit .env and add your API key
```

### Error: "ModuleNotFoundError: No module named 'flask'"

**Solution**: Install dependencies

```bash
pip install -r requirements.txt
```

### Error: "Address already in use"

**Solution**: Port 5000 is occupied

```bash
# Kill existing process or change port in .env
PORT=5001
```

---

## ✅ Next: Connect Frontend

After backend is running, update frontend to fetch data from:

```javascript
const API_URL = 'http://localhost:5000/api';
```

---

**Status**: 🟢 Backend Ready  
**Port**: 5000  
**Next**: Update Frontend to connect to Backend
