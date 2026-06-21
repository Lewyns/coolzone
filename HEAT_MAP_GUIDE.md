# 🌡️ Heat Map Feature - Complete Guide

## 🎉 **Feature Complete!**

ฟีเจอร์ Heat Map Comparison พร้อมใช้งานแล้ว! แต่ต้อง **restart backend** ก่อน

---

## 🚀 **วิธีรัน (Quick Start):**

### **1. Start Backend**
```bash
cd C:\project\hackatech-2026-v1.2\backend
python app.py
```

รอจนเห็นข้อความ:
```
==================================================
🌡️  CoolZone Backend API
==================================================
📍 Running on: http://localhost:5000
```

### **2. Start Frontend**
เปิด Terminal ใหม่:
```bash
cd C:\project\hackatech-2026-v1.2\frontend
python -m http.server 8000
```

### **3. Open Browser**
```
http://localhost:8000
```

---

## ✅ **สิ่งที่จะเห็น:**

### **1. Heat Markers บนแผนที่**
- 🟢 เขียว = เย็น (Indoor AC, ห้องสมุด)
- 🟢 เขียวอ่อน = เย็นสบาย (สวนลุมพินี)
- 🟡 เหลือง = อบอุ่น (ริมแม่น้ำ)
- 🟠 ส้ม = ร้อน (ใต้สะพาน)
- 🔴 แดง = ร้อนมาก (พื้นที่โล่ง)

### **2. คลิก Marker**
Popup แสดง:
- ชื่อสถานที่
- Heat Score + Emoji
- อุณหภูมิโดยประมาณ
- ระยะทาง
- ประเภท (ห้องแอร์/สีเขียว/ใกล้น้ำ)
- กิจกรรมที่เหมาะสม
- ข้อดี/ข้อเสีย
- ปุ่ม: [เปรียบเทียบ] [นำทาง]

### **3. เปรียบเทียบสถานที่**
- คลิก "เปรียบเทียบ" จาก popup
- Comparison Panel ปรากฏด้านล่าง
- เปรียบเทียบได้สูงสุด 3 สถานที่
- เห็นข้อมูลแบบ side-by-side

### **4. กรองตามประเภท**
- คลิก "🔍 กรอง" ที่ Bottom Nav
- เลือก:
  - ทั้งหมด
  - 🏢 ห้องแอร์
  - 🌳 สีเขียว
  - 🌊 ใกล้น้ำ
  - 🏛️ ร่มเงา

---

## 🧪 **Test Checklist:**

```
[ ] เปิดเว็บ → เห็น heat markers
[ ] คลิก marker → popup เปิด
[ ] คลิก "เปรียบเทียบ" → เพิ่มเข้า comparison panel
[ ] เพิ่ม 2-3 สถานที่ → เห็นการเปรียบเทียบ
[ ] คลิก "🔍 กรอง" → modal เปิด
[ ] เลือก "🏢 ห้องแอร์" → markers กรอง
[ ] คลิก "ล้างทั้งหมด" → comparison panel หาย
```

---

## 🔧 **Troubleshooting:**

### **ปัญหา: Heat markers ไม่แสดง**
```
1. เช็ค backend รันอยู่หรือไม่
2. เช็ค console (F12) มี error หรือไม่
3. ลอง refresh (Ctrl+R)
```

### **ปัญหา: API 404 Not Found**
```
→ Backend ยังไม่ได้ restart
→ Stop backend (Ctrl+C) แล้ว run ใหม่
```

### **ปัญหา: Markers สีเดียวกันหมด**
```
→ Heat score algorithm working
→ ตรวจสอบ current weather
→ ปกติ indoor AC จะเย็นกว่า outdoor
```

---

## 📊 **Expected Heat Scores:**

| สถานที่ | Score | สี | คำอธิบาย |
|---------|-------|-----|----------|
| BTS สยาม | 15 | 🟢 | เย็นฉ่ำ (แอร์) |
| MRT สุขุมวิท | 15 | 🟢 | เย็นฉ่ำ (แอร์) |
| ห้องสมุด | 16 | 🟢 | เย็นฉ่ำ (แอร์) |
| สยามพารากอน | 17 | 🟢 | เย็นฉ่ำ (แอร์) |
| สวนลุมพินี | 24 | 🟢 | เย็นสบาย (ร่มเงา) |
| สวนเบญจกิติ | 30 | 🟢 | เย็นสบาย (ร่มเงา) |
| ริมเจ้าพระยา | 35 | 🟡 | อบอุ่น (ลมเย็น) |
| Asiatique | 45 | 🟡 | อบอุ่น (ร่มเงาน้อย) |
| ใต้สะพาน BTS | 52 | 🟠 | ร้อน (อับชื้น) |

---

## 📱 **Mobile View:**

- ✅ Heat markers responsive
- ✅ Popup ปรับขนาด
- ✅ Comparison panel scroll ได้
- ✅ Filter modal แบบ bottom sheet

---

## 🎯 **Key Features Summary:**

1. **Heat Map Visualization** ✅
   - Custom markers สีตาม heat score
   - Emoji indicators

2. **Interactive Popups** ✅
   - รายละเอียดครบถ้วน
   - กิจกรรม + ข้อดี/ข้อเสีย

3. **Location Comparison** ✅
   - เปรียบเทียบ side-by-side
   - ชัดเจน ง่ายต่อการตัดสินใจ

4. **Type Filters** ✅
   - 5 ประเภทหลัก
   - กรองแบบ real-time

5. **Smart Scoring** ✅
   - พิจารณา 7 ปัจจัย
   - คำนวณแม่นยำ

---

## 📄 **API Endpoints:**

### **GET /api/heat-map**
```
Parameters:
- lat (required)
- lng (required)
- type_filter (optional): all, indoor_ac, green_space, near_water, outdoor_shaded
- radius (optional): default 10000m

Example:
http://localhost:5000/api/heat-map?lat=13.7563&lng=100.5018&type_filter=all
```

### **GET /api/heat-map/compare**
```
Parameters:
- location_ids (required): comma-separated

Example:
http://localhost:5000/api/heat-map/compare?location_ids=1,2,3
```

---

## 🎨 **Design Decisions:**

### **Why Heat Score?**
- แทนที่จะแค่แนะนำห้องแอร์
- ให้เลือกได้ตามความต้องการ
- เปรียบเทียบความร้อนชัดเจน

### **Why 5 Types?**
- ครอบคลุมทุก use case:
  - ต้องการแอร์ → Indoor AC
  - ชอบธรรมชาติ → Green Space
  - ชอบริมน้ำ → Near Water
  - แค่หาร่มเงา → Outdoor Shaded

### **Why Comparison Panel?**
- ช่วยตัดสินใจ
- เห็นข้อดี-ข้อเสียชัดเจน
- เปรียบเทียบได้ง่าย

---

## 🚀 **Next Steps (Future):**

1. **Real Weather Integration**
   - ดึงอุณหภูมิจริงจาก API
   - Heat score แม่นยำขึ้น

2. **User Reviews**
   - ให้ผู้ใช้รีวิว
   - Rate ความเย็น

3. **Route Planning**
   - แผนเส้นทางหลบร้อน
   - แนะนำจุดพักระหว่างทาง

4. **Crowdsourced Data**
   - ผู้ใช้เพิ่มสถานที่ใหม่
   - Community-driven

---

**พร้อมแล้วครับ! Restart backend แล้วทดสอบได้เลย! 🎉**
