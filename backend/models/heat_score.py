"""
Heat Score Calculator
คำนวณคะแนนความร้อนสะสมของพื้นที่ (0-100)

Score ยิ่งต่ำ = พื้นที่ยิ่งเย็น
Score ยิ่งสูง = พื้นที่ยิ่งร้อน
"""
# -*- coding: utf-8 -*-

def calculate_heat_score(location, current_weather):
    """
    คำนวณ Heat Score จากข้อมูลพื้นที่และสภาพอากาศ

    Args:
        location (dict): ข้อมูลพื้นที่ จาก locations_extended.json
        current_weather (dict): {
            'temperature': float,  # อุณหภูมิปัจจุบัน (°C)
            'humidity': int        # ความชื้น (%)
        }

    Returns:
        dict: {
            'score': int (0-100),
            'level': str ('very_cool', 'cool', 'warm', 'hot', 'very_hot'),
            'estimated_temp': float,
            'description': str
        }
    """

    base_temp = current_weather['temperature']
    humidity = current_weather['humidity']

    # ============================================
    # 1. Base Score from Temperature
    # ============================================
    # 25°C = 20 points, 35°C = 60 points, 40°C = 80 points
    if base_temp <= 25:
        score = 20
    elif base_temp <= 35:
        score = 20 + (base_temp - 25) * 4  # 10°C range = 40 points
    else:
        score = 60 + (base_temp - 35) * 4  # Each degree above 35 = 4 points

    # ============================================
    # 2. Humidity Adjustment
    # ============================================
    # ความชื้นสูง = ร้อนขึ้น (humid heat)
    # 50% = neutral, 100% = +15 points
    humidity_modifier = (humidity - 50) * 0.3
    score += humidity_modifier

    # ============================================
    # 3. Surface Type Adjustment
    # ============================================
    surface_modifiers = {
        'concrete': +15,   # คอนกรีตดูดความร้อน
        'asphalt': +20,    # ยางมะตอยร้อนที่สุด
        'tile': +5,        # กระเบื้องดีกว่าคอนกรีต
        'wood': 0,         # ไม้ neutral
        'grass': -10,      # หญ้าเย็นกว่า
        'soil': -5,        # ดินเย็นกว่าคอนกรีต
        'water': -15       # น้ำเย็นที่สุด
    }
    surface = location.get('surface', 'concrete')
    score += surface_modifiers.get(surface, 0)

    # ============================================
    # 4. Shade Level Adjustment
    # ============================================
    # ร่มเงา 100% = -30 points
    # ร่มเงา 0% = 0 points
    shade_level = location.get('shade_level', 0)
    score -= shade_level * 0.3

    # ============================================
    # 5. AC Bonus
    # ============================================
    # ถ้ามีแอร์ = -40 points (เย็นมาก!)
    if location.get('has_ac', False):
        score -= 40

    # ============================================
    # 6. Near Water Bonus
    # ============================================
    # ใกล้น้ำ = ลมเย็น = -5 points
    if location.get('has_water', False):
        score -= 5

    # ============================================
    # 7. Type-specific Adjustments
    # ============================================
    location_type = location.get('type', 'open_area')

    if location_type == 'indoor_ac':
        score -= 10  # Indoor มักเย็นกว่า outdoor
    elif location_type == 'green_space':
        score -= 5   # พื้นที่สีเขียวมักเย็นกว่า
    elif location_type == 'near_water':
        score -= 8   # ใกล้น้ำเย็นกว่า
    elif location_type == 'outdoor_shaded':
        score -= 3   # มีร่มเงาพอสมควร

    # ============================================
    # 8. Clamp Score to 0-100
    # ============================================
    score = max(0, min(100, score))

    # ============================================
    # 9. Determine Level
    # ============================================
    if score < 20:
        level = 'very_cool'
        description = 'เย็นฉ่ำ เหมาะพักผ่อนนาน'
    elif score < 40:
        level = 'cool'
        description = 'เย็นสบาย เหมาะอยู่นาน'
    elif score < 60:
        level = 'warm'
        description = 'อบอุ่น เหมาะกิจกรรมเบาๆ'
    elif score < 80:
        level = 'hot'
        description = 'ร้อน ควรระวัง ไม่ควรอยู่นาน'
    else:
        level = 'very_hot'
        description = 'ร้อนมาก อันตราย หลีกเลี่ยง'

    # ============================================
    # 10. Estimate Felt Temperature
    # ============================================
    # คำนวณอุณหภูมิที่รู้สึกได้โดยประมาณ
    estimated_temp = base_temp

    # ปรับตาม shade
    if location.get('has_ac'):
        estimated_temp = 24  # แอร์โดยเฉลี่ย 24°C
    else:
        # ไม่มีร่มเงา = ร้อนขึ้น
        shade_factor = (100 - shade_level) / 100
        estimated_temp += shade_factor * 3

        # พื้นผิวร้อน = ร้อนขึ้น
        if surface in ['concrete', 'asphalt']:
            estimated_temp += 2
        elif surface in ['grass', 'soil']:
            estimated_temp -= 1

        # ใกล้น้ำ = เย็นลง
        if location.get('has_water'):
            estimated_temp -= 1.5

    # ============================================
    # 11. Return Result
    # ============================================
    return {
        'score': int(round(score)),
        'level': level,
        'estimated_temp': round(estimated_temp, 1),
        'description': description,
        'breakdown': {
            'base_temp': base_temp,
            'humidity': humidity,
            'surface': surface,
            'shade': shade_level,
            'has_ac': location.get('has_ac', False),
            'has_water': location.get('has_water', False)
        }
    }


def get_heat_color(score):
    """
    แปลง Heat Score เป็นสีแสดงบนแผนที่

    Args:
        score (int): Heat Score (0-100)

    Returns:
        str: Hex color code
    """
    if score < 20:
        return '#00FF00'  # Green - เย็นมาก
    elif score < 40:
        return '#90EE90'  # Light Green - เย็น
    elif score < 60:
        return '#FFFF00'  # Yellow - อบอุ่น
    elif score < 80:
        return '#FFA500'  # Orange - ร้อน
    else:
        return '#FF0000'  # Red - ร้อนมาก


def get_heat_emoji(score):
    """
    แปลง Heat Score เป็น Emoji

    Args:
        score (int): Heat Score (0-100)

    Returns:
        str: Emoji
    """
    if score < 20:
        return '❄️'  # Snowflake
    elif score < 40:
        return '🟢'  # Green
    elif score < 60:
        return '🟡'  # Yellow
    elif score < 80:
        return '🟠'  # Orange
    else:
        return '🔴'  # Red


# ============================================
# Example Usage
# ============================================
if __name__ == '__main__':
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # Test with example location
    test_location = {
        'name': 'Lumphini Park',
        'type': 'green_space',
        'surface': 'grass',
        'shade_level': 70,
        'has_ac': False,
        'has_water': True
    }

    test_weather = {
        'temperature': 35.0,
        'humidity': 65
    }

    result = calculate_heat_score(test_location, test_weather)

    print('='*50)
    print(f"Location: {test_location['name']}")
    print(f"Weather: {test_weather['temperature']}C, {test_weather['humidity']}%")
    print('='*50)
    print(f"Heat Score: {result['score']}/100 {get_heat_emoji(result['score'])}")
    print(f"Level: {result['level']}")
    print(f"Estimated Temp: {result['estimated_temp']}C")
    print(f"Description: {result['description']}")
    print(f"Color: {get_heat_color(result['score'])}")
    print('='*50)
