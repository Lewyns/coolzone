# 🌡️ CoolZone - Urban Heat Warning System

> ระบบแผนที่เตือนภัยความร้อนแบบเรียลไทม์สำหรับเมืองไทย | Real-time Urban Heat Warning System for Thai Cities

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)]()

---

## 📖 สารบัญ | Table of Contents

- [ภาพรวม | Overview](#-ภาพรวม--overview)
- [คุณสมบัติ | Features](#-คุณสมบัติ--features)
- [เทคโนโลยี | Technology Stack](#️-เทคโนโลยี--technology-stack)
- [การติดตั้ง | Installation](#-การติดตั้ง--installation)
- [การใช้งาน | Usage](#-การใช้งาน--usage)
- [การปรับแต่ง | Customization](#-การปรับแต่ง--customization)
- [API Documentation](#-api-documentation)
- [โครงสร้างโปรเจค | Project Structure](#-โครงสร้างโปรเจค--project-structure)
- [การพัฒนา | Development](#-การพัฒนา--development)
- [License](#-license)
- [ผู้พัฒนา | Contributors](#-ผู้พัฒนา--contributors)

---

## 🎯 ภาพรวม | Overview

**CoolZone** เป็นระบบแผนที่อัจฉริยะที่ช่วยให้ประชาชนในเมืองหลีกเลี่ยงความเสี่ยงจากความร้อนสูง ผ่านการแสดงข้อมูลแบบเรียลไทม์บนแผนที่

**CoolZone** is an intelligent map system that helps urban residents avoid high heat risks through real-time data visualization on maps.

### 💡 ปัญหาที่แก้ไข | Problems We Solve

- 🌡️ **ความร้อนสูงในเมือง** - กรุงเทพฯ มี Heat Index ถึง 45°C+ ในช่วงฤดูร้อน
- 👴 **กลุ่มเสี่ยง** - ผู้สูงอายุและคนทำงานกลางแจ้งต้องการข้อมูลเฉพาะกลุ่ม
- 🏢 **จุดพักร้อน** - ยากต่อการค้นหาสถานที่หลบร้อนที่ใกล้ที่สุด
- ⚠️ **พื้นที่เสี่ยง** - ไม่รู้ว่าพื้นที่ไหนมีความเสี่ยงสูง

### ✨ Solution

CoolZone ให้บริการ:
- ✅ แผนที่แสดงข้อมูลความร้อนแบบเรียลไทม์
- ✅ คำนวณระดับความเสี่ยงตามกลุ่มผู้ใช้
- ✅ แนะนำจุดพักร้อนใกล้ที่สุด
- ✅ เตือนเมื่อเข้าใกล้พื้นที่เสี่ยง
- ✅ พยากรณ์อากาศ 6 ชั่วโมงข้างหน้า

---

## ✨ คุณสมบัติ | Features

### 🗺️ Interactive Map
- แผนที่ OpenStreetMap แบบ Interactive
- GPS tracking แบบเรียลไทม์
- แสดงตำแหน่งผู้ใช้บนแผนที่
- Recenter ไปยังตำแหน่งปัจจุบัน

### 🌡️ Weather & Heat Risk
- ดึงข้อมูลสภาพอากาศแบบเรียลไทม์จาก OpenWeatherMap
- คำนวณ Heat Index ด้วยสูตร NOAA
- ประเมินระดับความเสี่ยง (LOW / MEDIUM / HIGH)
- แสดงอุณหภูมิ, ความชื้น, Heat Index

### 🏢 Cooling Centers & Hazard Points
- แสดงจุดพักร้อน (ห้าง, สถานีรถไฟฟ้า, ห้องสมุด)
- แยกสีตามประเภท: 🆓 ฟรี / 🏢 เสียค่าใช้จ่าย
- แสดงพื้นที่เสี่ยงสูง
- แยกสีตามความเสี่ยง: 🔴 สูง / 🟡 กลาง / 🟢 ต่ำ
- คำนวณระยะทางจากผู้ใช้
- Toggle เปิด/ปิดแต่ละ Layer

### 👤 Risk Profiles & Filters
- เลือกกลุ่มเสี่ยงได้ 3 แบบ:
  - 👤 **General** (ทั่วไป) - เกณฑ์ปกติ
  - 👴 **Elderly** (ผู้สูงอายุ) - เกณฑ์ต่ำกว่า
  - 🔨 **Outdoor Worker** (คนทำงานกลางแจ้ง) - เกณฑ์กลาง
- แนะนำ Top 3 จุดพักร้อนใกล้ที่สุด
- กรองตามประเภทและระยะทาง

### 📊 Forecast & Notifications
- พยากรณ์อากาศ 6 ชั่วโมงข้างหน้า
- แสดง Heat Index และ Risk Level แต่ละช่วง
- แจ้งเตือนเมื่อเข้าใกล้พื้นที่เสี่ยงสูง (< 500m)
- แจ้งเตือน 2 รูปแบบ: Browser + In-App

---

## 🛠️ เทคโนโลยี | Technology Stack

### Frontend
- **HTML5** - Structure
- **Tailwind CSS** - Styling
- **JavaScript (Vanilla)** - Logic
- **Leaflet.js** - Interactive maps
- **OpenStreetMap** - Map tiles

### Backend
- **Python 3.8+** - Runtime
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin support
- **OpenWeatherMap API** - Weather data
- **python-dotenv** - Environment variables

### APIs
- **OpenWeatherMap API** - Current weather & forecast
- **Nominatim** - Geocoding (optional)

---

## 📦 การติดตั้ง | Installation

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **OpenWeatherMap API Key** (ฟรี! [Sign up](https://openweathermap.org/api))
- **Web Browser** (Chrome, Firefox, Safari, Edge)

### 1. Clone Repository

```bash
git clone https://github.com/Lewyns/coolzone.git
cd coolzone
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your API key
# Windows: notepad .env
# macOS/Linux: nano .env
```

**`.env` file:**
```env
OPENWEATHER_API_KEY=your_api_key_here
PORT=5000
```

### 3. Get OpenWeatherMap API Key

1. ไปที่ https://openweathermap.org/api
2. คลิก "Sign Up" และสมัครสมาชิก (ฟรี!)
3. ยืนยัน Email
4. Copy API Key จาก Dashboard
5. วางใน `.env` file

---

## 🚀 การใช้งาน | Usage

### Start Backend Server

```bash
cd backend
python app.py
```

**ควรเห็น:**
```
==================================================
🌡️  CoolZone Backend API
==================================================
📍 Running on: http://localhost:5000
🔧 Debug mode: True
🔑 API Key configured: True
==================================================
```

### Start Frontend Server

**เปิด Terminal ใหม่:**
```bash
cd frontend
python -m http.server 8000
```

**ควรเห็น:**
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### Open Browser

เปิดเบราว์เซอร์ไปที่:
```
http://localhost:8000
```

---

## 🎨 การปรับแต่ง | Customization

### 📍 ปรับแต่งจุดพักร้อน | Customize Cooling Centers

แก้ไขไฟล์ `data/processed/cooling_centers.json`:

```json
{
  "id": 1,
  "name": "ชื่อสถานที่",
  "name_en": "Place Name",
  "type": "free",              // "free" หรือ "paid"
  "category": "shopping_mall",  // ประเภทสถานที่
  "lat": 13.7467,              // ละติจูด
  "lng": 100.5348,             // ลองจิจูด
  "address": "ที่อยู่",
  "hours": "10:00-22:00",
  "phone": "02-xxx-xxxx",
  "amenities": ["restroom", "water", "seating", "food", "wifi"],
  "capacity": "high",          // "low", "medium", "high"
  "accessibility": true
}
```

**Categories ที่ใช้ได้:**
- `shopping_mall` - ห้างสรรพสินค้า
- `library` - ห้องสมุด
- `transit` - สถานีขนส่ง
- `park` - สวนสาธารณะ
- `convenience_store` - ร้านสะดวกซื้อ
- `hospital` - โรงพยาบาล
- `community_center` - ศูนย์ชุมชน

### ⚠️ ปรับแต่งพื้นที่เสี่ยง | Customize Hazard Points

แก้ไขไฟล์ `data/processed/hazard_points.json`:

```json
{
  "id": 1,
  "name": "ชื่อพื้นที่",
  "name_en": "Area Name",
  "risk_level": "high",        // "low", "medium", "high"
  "lat": 13.7458,
  "lng": 100.5331,
  "address": "ที่อยู่",
  "description": "คำอธิบาย",
  "warning": "คำเตือน",
  "heat_factors": ["no_shade", "concrete", "heat_reflection"]
}
```

**Heat Factors ที่ใช้ได้:**
- `no_shade` - ไม่มีร่มเงา
- `concrete` - พื้นคอนกรีต
- `asphalt` - พื้นแอสฟัลต์
- `heat_reflection` - สะท้อนความร้อน
- `traffic_pollution` - มลพิษจากการจราจร
- `crowded` - พื้นที่แออัด
- `poor_ventilation` - อากาศไม่ถ่ายเท
- `open_area` - พื้นที่เปิดโล่ง
- `limited_shade` - ร่มเงาจำกัด
- `water_reflection` - สะท้อนจากน้ำ

### 🎨 ปรับแต่ง UI/UX

แก้ไขไฟล์:
- `frontend/index.html` - โครงสร้าง HTML
- `frontend/src/app.js` - Logic และ functionality
- `frontend/src/config.js` - การตั้งค่า API URL

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Weather API is running",
  "api_configured": true
}
```

#### 2. Current Weather
```http
GET /api/weather?lat=13.7563&lng=100.5018&profile=general
```

**Parameters:**
- `lat` (float, required) - Latitude
- `lng` (float, required) - Longitude
- `profile` (string, optional) - `general`, `elderly`, `outdoor_worker`

#### 3. 6-Hour Forecast
```http
GET /api/forecast?lat=13.7563&lng=100.5018&hours=6&profile=general
```

#### 4. Cooling Centers
```http
GET /api/cooling-centers?lat=13.7563&lng=100.5018&radius=5000&limit=20
```

#### 5. Hazard Points
```http
GET /api/hazard-points?lat=13.7563&lng=100.5018&radius=5000
```

ดูเพิ่มเติมใน [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 📁 โครงสร้างโปรเจค | Project Structure

```
coolzone/
│
├── backend/                    # Python Flask API
│   ├── app.py                 # Main server
│   ├── .env.example           # Environment template
│   ├── requirements.txt       # Dependencies
│   │
│   ├── api/routes/            # API endpoints
│   │   ├── weather.py
│   │   ├── cooling_centers.py
│   │   ├── hazard_points.py
│   │   └── heat_map.py
│   │
│   ├── models/                # Data models
│   │   ├── heat.py
│   │   └── heat_score.py
│   │
│   └── services/              # Business logic
│       └── weather_service.py
│
├── frontend/                   # HTML + JS
│   ├── index.html            # Main page
│   └── src/
│       ├── app.js            # Application logic
│       ├── api.js            # API client
│       ├── markers.js        # Map markers
│       └── config.js         # Configuration
│
├── data/processed/            # Data files
│   ├── cooling_centers.json  # Cooling centers data
│   └── hazard_points.json    # Hazard points data
│
├── LICENSE                    # MIT License
├── README.md                  # This file
├── HOW_TO_RUN.md             # Quick start guide
└── .gitignore                # Git ignore rules
```

---

## 🔧 การพัฒนา | Development

### Running Tests

```bash
# Backend API tests
cd backend
python -m pytest tests/

# Manual API testing
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/weather?lat=13.7563&lng=100.5018"
```

### Adding New Features

1. **Backend** - เพิ่ม endpoint ใน `backend/api/routes/`
2. **Frontend** - เพิ่ม function ใน `frontend/src/app.js`
3. **Data** - เพิ่มข้อมูลใน `data/processed/`
4. **Test** - ทดสอบทั้ง API และ UI
5. **Document** - อัปเดตเอกสาร

### Code Style

- **Python** - PEP 8
- **JavaScript** - Standard JS
- **HTML/CSS** - BEM naming

---

## 🐛 Troubleshooting

### Backend ไม่ทำงาน | Backend Not Working

```bash
# ตรวจสอบ backend
curl http://localhost:5000/api/health

# ถ้าไม่ทำงาน ให้เริ่มใหม่
cd backend
python app.py
```

### Frontend ไม่เชื่อมต่อ API

```bash
# ตรวจสอบ CORS settings
# ให้แน่ใจว่า frontend รันที่ port 8000
cd frontend
python -m http.server 8000
```

### GPS ไม่ทำงาน

- อนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์
- GPS ทำงานเฉพาะ `http://localhost` หรือ `https://`
- ไม่ทำงานกับ `file://` protocol

---

## 🤝 Contributing

เรายินดีรับ contributions! กรุณา:

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**สรุป:** คุณสามารถใช้, แก้ไข, และแจกจ่ายโปรเจคนี้ได้อย่างอิสระ ทั้งในโปรเจคส่วนตัวและเชิงพาณิชย์

---

## 👥 ผู้พัฒนา | Contributors

- **Chicken.4r1n**

พัฒนาสำหรับ **Hackatech 2026**

---

## 🙏 Acknowledgments

- **OpenWeatherMap** - Weather data API
- **OpenStreetMap** - Map tiles
- **Leaflet.js** - Map library
- **Tailwind CSS** - UI framework

---

## 📞 Contact

- **GitHub Issues:** [Report a bug or request a feature](https://github.com/Lewyns/coolzone/issues)
- **Email:** lewyns1984@gmail.com

---

**Made with ❤️ for safer cities**
