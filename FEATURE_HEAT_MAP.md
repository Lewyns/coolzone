# 🌡️ Heat Map Comparison Feature

## 🎯 Concept

แทนที่จะแค่แนะนำจุดพักร้อนในห้องแอร์ ให้เพิ่มฟีเจอร์ **"Heat Map Comparison"** เพื่อแสดงและเปรียบเทียบความร้อนสะสมของแต่ละพื้นที่ ช่วยให้ผู้ใช้:

1. **เลือกพื้นที่ตามความต้องการ** - อาจไม่อยากเข้าห้างแต่อยากไปสวนสาธารณะ
2. **เปรียบเทียบความร้อน** - ดูว่าพื้นที่ไหนเย็นกว่ากัน
3. **ครอบคลุมทุกพื้นที่** - ไม่จำกัดแค่จุดพักร้อนที่เรามีข้อมูล

---

## 📊 Feature Overview

### **1. Heat Accumulation Score**
คำนวณคะแนนความร้อนสะสมของแต่ละพื้นที่จาก:
- อุณหภูมิปัจจุบัน
- ความชื้น
- พื้นผิว (คอนกรีต/พื้นเขียว/น้ำ)
- ร่มเงา (มี/ไม่มี)
- เวลา (กลางวัน/กลางคืน)

### **2. Location Types**
แบ่งพื้นที่เป็น:
- 🏢 **Indoor (AC)** - ห้างสรรพสินค้า, สถานีรถไฟฟ้า, คาเฟ่
- 🌳 **Green Space** - สวนสาธารณะ, พื้นที่สีเขียว
- 🏛️ **Outdoor Shaded** - ที่ร่ม, ใต้สะพาน, ลานมีหลังคา
- 🌊 **Near Water** - แม่น้ำ, สระน้ำ, น้ำพุ
- ☀️ **Open Area** - ลานโล่ง, ทางเดิน, ถนน

### **3. Comparison View**
แสดงเปรียบเทียบ:
- Heat Score (0-100)
- อุณหภูมิโดยประมาณ
- ข้อดี/ข้อเสีย
- เหมาะกับกิจกรรมอะไร

---

## 🎨 UI/UX Design

### **Option 1: Heat Map Layer**
```
แผนที่แสดงสี Heat Zone:
- 🔴 แดง = ร้อนมาก (> 40°C)
- 🟠 ส้ม = ร้อน (35-40°C)
- 🟡 เหลือง = อบอุ่น (30-35°C)
- 🟢 เขียว = เย็นสบาย (< 30°C)
```

### **Option 2: Location Cards with Heat Score**
```
┌─────────────────────────────┐
│ 🌳 ลุมพินีปาร์ค             │
│                             │
│ Heat Score: 65/100 🟡       │
│ ~33°C (Shaded areas)        │
│                             │
│ ✅ พื้นที่สีเขียว            │
│ ✅ มีร่มเงา                  │
│ ❌ ไม่มีแอร์                 │
│                             │
│ เหมาะกับ: วิ่ง, เดิน, นั่งชิล│
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🏢 สยามพารากอน               │
│                             │
│ Heat Score: 20/100 🟢       │
│ ~24°C (AC)                  │
│                             │
│ ✅ แอร์เย็นฉ่ำ               │
│ ✅ ไม่โดนแดด                 │
│ ❌ Indoor เท่านั้น           │
│                             │
│ เหมาะกับ: ช้อปปิ้ง, นั่งพัก  │
└─────────────────────────────┘
```

### **Option 3: Compare Mode**
```
เลือก 2-3 สถานที่เพื่อเปรียบเทียบ:

┌──────────┬──────────┬──────────┐
│ ลุมพินี  │ สยาม     │ เจ้าพระยา│
├──────────┼──────────┼──────────┤
│ 🟡 65    │ 🟢 20    │ 🟢 40    │
│ ~33°C    │ ~24°C    │ ~28°C    │
│ เงา 70%  │ AC 100%  │ น้ำ/เงา  │
│ ฟรี      │ เสีย     │ ฟรี      │
└──────────┴──────────┴──────────┘
```

---

## 🔧 Technical Implementation

### **1. Heat Score Calculation**

```python
def calculate_heat_score(location):
    """
    คำนวณ Heat Score (0-100, ยิ่งต่ำยิ่งเย็น)
    """
    base_temp = location['temperature']
    humidity = location['humidity']
    surface_type = location['surface']  # concrete, grass, water
    shade_level = location['shade']      # 0-100%
    
    # Base score from temperature
    score = (base_temp - 20) * 2  # 20°C = 0, 40°C = 40
    
    # Adjust for humidity
    score += (humidity - 50) * 0.3
    
    # Adjust for surface
    surface_modifier = {
        'concrete': +15,
        'asphalt': +20,
        'grass': -10,
        'water': -15,
        'soil': -5
    }
    score += surface_modifier.get(surface_type, 0)
    
    # Adjust for shade
    score -= shade_level * 0.3
    
    # Clamp to 0-100
    return max(0, min(100, score))
```

### **2. Data Structure**

```json
{
  "locations": [
    {
      "id": 1,
      "name": "ลุมพินีปาร์ค",
      "type": "green_space",
      "lat": 13.7308,
      "lng": 100.5418,
      "surface": "grass",
      "shade_level": 70,
      "has_ac": false,
      "has_water": true,
      "free": true,
      "activities": ["วิ่ง", "เดิน", "ปั่นจักรยาน", "นั่งชิล"],
      "pros": ["พื้นที่สีเขียว", "มีร่มเงา", "มีลม"],
      "cons": ["ไม่มีแอร์", "อาจร้อนเที่ยง"]
    },
    {
      "id": 2,
      "name": "สยามพารากอน",
      "type": "indoor_ac",
      "lat": 13.7469,
      "lng": 100.5347,
      "surface": "concrete",
      "shade_level": 100,
      "has_ac": true,
      "has_water": false,
      "free": false,
      "activities": ["ช้อปปิ้ง", "นั่งพัก", "กินข้าว"],
      "pros": ["แอร์เย็นฉ่ำ", "ไม่โดนแดด", "สะดวกสบาย"],
      "cons": ["เสียค่าใช้จ่าย", "Indoor เท่านั้น"]
    }
  ]
}
```

### **3. New API Endpoint**

```python
@app.route('/api/heat-comparison', methods=['GET'])
def get_heat_comparison():
    """
    เปรียบเทียบความร้อนของหลายพื้นที่
    
    Query:
        lat, lng: ตำแหน่งผู้ใช้
        location_ids: IDs ของพื้นที่ที่จะเปรียบเทียบ
        type_filter: all, green_space, indoor_ac, outdoor_shaded
    """
    pass
```

---

## 📁 Files to Create/Modify

### **Backend:**
1. `backend/data/locations_extended.json` - ข้อมูลพื้นที่ทั้งหมด
2. `backend/models/heat_score.py` - คำนวณ Heat Score
3. `backend/api/routes/heat_comparison.py` - API endpoint

### **Frontend:**
1. `frontend/src/heat-comparison.js` - Heat comparison logic
2. `frontend/index.html` - เพิ่ม UI components

---

## 🎯 User Flow

### **Flow 1: Browse & Compare**
1. เปิดแอป → เห็นแผนที่
2. คลิก "🌡️ เปรียบเทียบความร้อน"
3. เลือกประเภทพื้นที่: สีเขียว / แอร์ / ร่ม / ใกล้น้ำ
4. ระบบแสดง Heat Score ของแต่ละจุด
5. เลือก 2-3 จุดเพื่อเปรียบเทียบ
6. เห็นตาราง/การ์ดเปรียบเทียบ

### **Flow 2: Filter by Activity**
1. เลือกกิจกรรม: "วิ่ง", "เดิน", "นั่งชิล", "ช้อปปิ้ง"
2. ระบบกรองพื้นที่ที่เหมาะสม
3. เรียงตาม Heat Score (เย็น → ร้อน)
4. แสดงแนะนำ

---

## 💡 Benefits

### **1. ครอบคลุมทุกความต้องการ**
- ไม่จำกัดแค่ห้องแอร์
- รองรับคนชอบ outdoor activities

### **2. ข้อมูลชัดเจน**
- เห็นว่าพื้นที่ไหนร้อนกว่ากัน
- เปรียบเทียบได้ง่าย

### **3. ตัดสินใจได้ดีขึ้น**
- รู้ข้อดี-ข้อเสีย
- เลือกตามความชอบ

### **4. Scalable**
- เพิ่มพื้นที่ใหม่ได้ง่าย
- Community-driven (ผู้ใช้เสนอพื้นที่ได้)

---

## 🚀 Implementation Phases

### **Phase 1: Data Preparation** (1 hour)
- สร้าง locations_extended.json
- เพิ่มข้อมูล 15-20 พื้นที่หลากหลาย

### **Phase 2: Backend** (1 hour)
- สร้าง heat_score.py
- สร้าง API endpoint
- ทดสอบ calculation

### **Phase 3: Frontend** (2 hours)
- เพิ่ม Heat Comparison UI
- Location cards with scores
- Compare mode
- Filters

### **Phase 4: Integration** (30 min)
- เชื่อม Frontend ↔ Backend
- ทดสอบทุกฟีเจอร์

**Total: ~4.5 hours**

---

## 🎨 UI Mockup

### **Main View:**
```
┌─────────────────────────────────┐
│  🌡️ เปรียบเทียบความร้อน         │
├─────────────────────────────────┤
│                                 │
│  ประเภท: [🌳] [🏢] [🏛️] [🌊]    │
│                                 │
│  เรียงตาม: ความเย็น ▼            │
│                                 │
├─────────────────────────────────┤
│ ┌───────────────────────────┐  │
│ │ 🌊 ริมเจ้าพระยา            │  │
│ │ Heat Score: 35 🟢         │  │
│ │ ~28°C | ฟรี               │  │
│ │ [เปรียบเทียบ]             │  │
│ └───────────────────────────┘  │
│                                 │
│ ┌───────────────────────────┐  │
│ │ 🌳 ลุมพินีปาร์ค            │  │
│ │ Heat Score: 65 🟡         │  │
│ │ ~33°C | ฟรี               │  │
│ │ [เปรียบเทียบ]             │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🔥 Next Steps

**ถามก่อนครับ:**

1. **ชอบ Option ไหน?**
   - Option 1: Heat Map Layer (สีบนแผนที่)
   - Option 2: Location Cards (การ์ด + Heat Score)
   - Option 3: Compare Mode (เลือก 2-3 จุดเปรียบเทียบ)
   - หรือรวมทั้งหมด?

2. **ข้อมูลพื้นที่:**
   - ให้ผมสร้างข้อมูลตัวอย่าง 15-20 พื้นที่?
   - หรือมีพื้นที่เฉพาะที่อยากเพิ่ม?

3. **Priority:**
   - ทำทั้งหมดเลย?
   - หรือทำทีละ Phase?

บอกได้เลยครับ แล้วผมจะเริ่มทำทันที! 🚀
