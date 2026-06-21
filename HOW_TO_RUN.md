# 🚀 วิธีรันโปรเจค CoolZone

## ✅ ก่อนเริ่ม - ติดตั้งโปรแกรมที่จำเป็น

### 1. Python 3.8+
ตรวจสอบว่ามีหรือยัง:
```bash
python --version
```

ถ้ายังไม่มี → ดาวน์โหลดจาก: https://www.python.org/downloads/

### 2. Text Editor (เลือกอันใดอันหนึ่ง)
- VS Code (แนะนำ): https://code.visualstudio.com/
- Notepad++: https://notepad-plus-plus.org/
- หรือ Text Editor ที่มีอยู่แล้ว

---

## 📥 ขั้นตอนที่ 1: ดาวน์โหลดโปรเจค

### วิธีที่ 1: ดาวน์โหลด ZIP (ง่ายที่สุด)
1. ไปที่ GitHub repo
2. คลิกปุ่ม "Code" (สีเขียว)
3. เลือก "Download ZIP"
4. แตกไฟล์ไปที่ตำแหน่งที่ต้องการ เช่น `C:\coolzone`

### วิธีที่ 2: Git Clone (ถ้ามี Git)
```bash
git clone https://github.com/your-username/coolzone.git
cd coolzone
```

---

## 🔑 ขั้นตอนที่ 2: ขอ API Key จาก OpenWeatherMap

### 2.1 สมัคร OpenWeatherMap (ฟรี!)

1. ไปที่: https://openweathermap.org/api
2. คลิก "Sign Up"
3. กรอกข้อมูล:
   - Email
   - Username
   - Password
4. ยืนยัน Email

### 2.2 รับ API Key

1. Login เข้า https://openweathermap.org/
2. ไปที่ "My API Keys"
3. Copy API Key (ตัวอย่าง: `abc123def456...`)
4. **เก็บไว้ดีๆ จะใช้ในขั้นตอนถัดไป**

⏱️ **หมายเหตุ:** API Key จะใช้งานได้ภายใน 1-2 ชั่วโมง

---

## ⚙️ ขั้นตอนที่ 3: ติดตั้ง Backend

### 3.1 เปิด Command Prompt / Terminal

**Windows:**
- กด `Win + R`
- พิมพ์ `cmd`
- Enter

**Mac/Linux:**
- เปิด Terminal

### 3.2 ไปยังโฟลเดอร์โปรเจค

```bash
# Windows
cd C:\coolzone\backend

# Mac/Linux
cd ~/coolzone/backend
```

### 3.3 ติดตั้ง Python packages

```bash
pip install -r requirements.txt
```

ระบบจะติดตั้ง:
- Flask
- Flask-CORS
- python-dotenv
- requests

⏱️ **ใช้เวลา:** 1-2 นาที

### 3.4 สร้างไฟล์ `.env`

**Option A: ใช้ Notepad**
1. เปิด Notepad
2. วางโค้ดนี้:
```
OPENWEATHER_API_KEY=วาง_API_KEY_ที่คุณได้มาตรงนี้
PORT=5000
```
3. Save As:
   - File name: `.env` (ต้องมีจุดนำหน้า)
   - Save as type: All Files
   - ที่: `backend` folder

**Option B: ใช้ Command Line**
```bash
# Windows (PowerShell)
echo "OPENWEATHER_API_KEY=your_api_key_here" > .env
echo "PORT=5000" >> .env

# Mac/Linux
echo "OPENWEATHER_API_KEY=your_api_key_here" > .env
echo "PORT=5000" >> .env
```

**ตัวอย่าง `.env` ที่ถูกต้อง:**
```
OPENWEATHER_API_KEY=abc123def456789xyz
PORT=5000
```

⚠️ **สำคัญ:** แทนที่ `abc123def456789xyz` ด้วย API Key จริงของคุณ

---

## 🚀 ขั้นตอนที่ 4: รัน Backend

### 4.1 รัน Backend Server

```bash
python app.py
```

### 4.2 ตรวจสอบว่ารันสำเร็จ

ควรเห็นข้อความแบบนี้:

```
==================================================
🌡️  CoolZone Backend API
==================================================
📍 Running on: http://localhost:5000
🔧 Debug mode: True
🔑 API Key configured: True
==================================================

 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://127.0.0.1:5000
```

✅ **ถ้าเห็นแบบนี้ = สำเร็จ!**

❌ **ถ้าเจอ Error:**

**Error: ModuleNotFoundError**
→ รัน `pip install -r requirements.txt` อีกครั้ง

**Error: API Key not found**
→ ตรวจสอบไฟล์ `.env` ว่ามี API Key หรือยัง

**Error: Port 5000 is already in use**
→ เปลี่ยน PORT ในไฟล์ `.env` เป็น `5001` หรือ `8080`

---

## 🌐 ขั้นตอนที่ 5: รัน Frontend

### 5.1 เปิด Command Prompt / Terminal ใหม่ (อันที่ 2)

⚠️ **สำคัญ:** อย่าปิด Backend! ต้องเปิด Terminal ใหม่

### 5.2 ไปยังโฟลเดอร์ Frontend

```bash
# Windows
cd C:\coolzone\frontend

# Mac/Linux
cd ~/coolzone/frontend
```

### 5.3 รัน Frontend Server

**Option A: Python 3**
```bash
python -m http.server 8000
```

**Option B: Python 2 (ถ้า Option A ไม่ได้)**
```bash
python -m SimpleHTTPServer 8000
```

### 5.4 ตรวจสอบว่ารันสำเร็จ

ควรเห็นข้อความแบบนี้:

```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

✅ **ถ้าเห็นแบบนี้ = สำเร็จ!**

---

## 🎉 ขั้นตอนที่ 6: เปิดใช้งาน

### 6.1 เปิด Browser

เปิดอันใดอันหนึ่ง:
- Google Chrome (แนะนำ)
- Microsoft Edge
- Firefox
- Safari

### 6.2 เข้าเว็บไซต์

พิมพ์ URL:
```
http://localhost:8000
```

หรือ
```
http://127.0.0.1:8000
```

### 6.3 อนุญาตการเข้าถึงตำแหน่ง

เมื่อเว็บโหลดเสร็จ จะขอสิทธิ์:
```
"localhost" ต้องการใช้ตำแหน่งของคุณ
```

👉 **กด "อนุญาต" หรือ "Allow"**

### 6.4 รอโหลดข้อมูล

ระบบจะโหลดประมาณ 2-3 วินาที แล้วจะเห็น:
- ✅ แผนที่
- ✅ ตำแหน่งของคุณ (จุดสีน้ำเงิน)
- ✅ จุดพักร้อน (หมุดสีเขียว/น้ำเงิน)
- ✅ สภาพอากาศปัจจุบัน

🎊 **ใช้งานได้แล้ว!**

---

## 📋 สรุป - คำสั่งทั้งหมด

### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
# สร้างไฟล์ .env
python app.py
```

### Terminal 2: Frontend
```bash
cd frontend
python -m http.server 8000
```

### Browser
```
http://localhost:8000
```

---

## 🐛 แก้ปัญหาที่พบบ่อย

### ❌ Problem 1: Backend ไม่รัน

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
pip install flask flask-cors python-dotenv requests
```

### ❌ Problem 2: API Key ไม่ทำงาน

**Error:** `API Key configured: False`

**Solution:**
1. เปิดไฟล์ `.env`
2. ตรวจสอบว่า API Key ถูกต้อง
3. ไม่มีเว้นวรรคหรือตัวอักษรแปลกปลอม
4. Save แล้วรัน `python app.py` ใหม่

### ❌ Problem 3: GPS ไม่ทำงาน

**Solution:**
1. ตรวจสอบว่ากด "Allow" แล้ว
2. เปิด Location Services ในเครื่อง
3. Refresh หน้าเว็บ (F5)

### ❌ Problem 4: แผนที่ไม่แสดง

**Solution:**
1. ตรวจสอบ Internet connection
2. Refresh หน้าเว็บ (F5)
3. ลอง Browser อื่น

### ❌ Problem 5: ข้อมูลไม่แสดง

**Solution:**
1. เปิด Console (F12) → ดู Errors
2. ตรวจสอบว่า Backend รันอยู่หรือไม่
3. ลองเข้า http://localhost:5000/api/health
   - ถ้าได้ JSON = Backend ทำงาน ✅
   - ถ้า Error = Backend มีปัญหา ❌

---

## 🛑 วิธีปิดโปรแกรม

### ปิด Backend & Frontend:
1. ไปที่ Terminal ที่รันอยู่
2. กด `Ctrl + C` (Windows/Linux) หรือ `Cmd + C` (Mac)
3. พิมพ์ `Y` และ Enter (ถ้าถาม)

### ปิด Browser:
- ปิด Tab ปกติ

---

## 📂 โครงสร้างโฟลเดอร์

```
coolzone/
│
├── backend/                # Python Flask API
│   ├── app.py             # ← รันไฟล์นี้
│   ├── .env               # ← สร้างไฟล์นี้ (มี API Key)
│   ├── requirements.txt   # Dependencies
│   ├── api/
│   ├── models/
│   └── services/
│
├── frontend/              # HTML + JS
│   ├── index.html        # ← หน้าเว็บหลัก
│   └── src/
│       └── app.js        # Logic
│
├── data/                  # ข้อมูลจุดต่างๆ
│   └── processed/
│
├── README.md             # เอกสารโปรเจค
└── USER_GUIDE.md         # คู่มือใช้งาน
```

---

## 📞 ต้องการความช่วยเหลือ?

### ถ้ายังไม่ได้:
1. อ่านส่วน "แก้ปัญหาที่พบบ่อย" ข้างบน
2. ลอง Google Error message
3. เปิด Console (F12) ดู Error
4. ถ่ายภาพหน้าจอ Error แล้วถาม

### เช็คว่ารันอยู่หรือไม่:
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:8000

---

## ✅ Checklist ก่อนเริ่ม

- [ ] ติดตั้ง Python 3.8+ แล้ว
- [ ] ดาวน์โหลดโปรเจคแล้ว
- [ ] ได้ OpenWeatherMap API Key แล้ว
- [ ] สร้างไฟล์ `.env` แล้ว
- [ ] รัน `pip install -r requirements.txt` แล้ว
- [ ] มี Internet connection
- [ ] พร้อมเริ่มต้น! 🚀

---

## 🎯 Quick Start (สำหรับคนเคยใช้)

```bash
# Terminal 1
cd backend
python app.py

# Terminal 2
cd frontend
python -m http.server 8000

# Browser
http://localhost:8000
```

---

**🎊 สนุกกับการใช้งาน CoolZone! 🌡️**

**Stay safe, stay cool! ❄️**
