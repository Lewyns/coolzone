# Heat Index Calculator
# Based on NOAA (National Oceanic and Atmospheric Administration) Formula

import math
from typing import Tuple

def calculate_heat_index(temp_c: float, humidity: float) -> float:
    """
    Calculate Heat Index using NOAA Regression Formula

    Args:
        temp_c: Temperature in Celsius
        humidity: Relative humidity (0-100)

    Returns:
        Heat Index in Celsius

    Raises:
        ValueError: If inputs are out of valid range
    """

    # Validate inputs
    if not (-50 <= temp_c <= 60):
        raise ValueError(f"Temperature out of range: {temp_c}°C (must be -50 to 60)")

    if not (0 <= humidity <= 100):
        raise ValueError(f"Humidity out of range: {humidity}% (must be 0 to 100)")

    # Convert Celsius to Fahrenheit for NOAA formula
    temp_f = (temp_c * 9/5) + 32

    # If temperature is low, heat index = temperature
    if temp_f < 80:
        return temp_c

    # NOAA Regression Equation
    # HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH
    #      - 0.00683783*T^2 - 0.05481717*RH^2 + 0.00122874*T^2*RH
    #      + 0.00085282*T*RH^2 - 0.00000199*T^2*RH^2

    T = temp_f
    RH = humidity

    hi = (
        -42.379 +
        2.04901523 * T +
        10.14333127 * RH -
        0.22475541 * T * RH -
        0.00683783 * T * T -
        0.05481717 * RH * RH +
        0.00122874 * T * T * RH +
        0.00085282 * T * RH * RH -
        0.00000199 * T * T * RH * RH
    )

    # Adjustments for low humidity and high temperature
    if RH < 13 and 80 <= T <= 112:
        adjustment = ((13 - RH) / 4) * math.sqrt((17 - abs(T - 95)) / 17)
        hi -= adjustment

    # Adjustments for high humidity and temperature
    if RH > 85 and 80 <= T <= 87:
        adjustment = ((RH - 85) / 10) * ((87 - T) / 5)
        hi += adjustment

    # Convert back to Celsius
    hi_c = (hi - 32) * 5/9

    return hi_c


def classify_risk(heat_index: float, profile: str = 'general') -> Tuple[str, int]:
    """
    Classify risk level based on Heat Index and user profile

    Args:
        heat_index: Calculated heat index in Celsius
        profile: User profile ('general', 'elderly', 'outdoor_worker')

    Returns:
        Tuple of (risk_level, risk_score)
        - risk_level: 'LOW', 'MEDIUM', 'HIGH'
        - risk_score: 0-100 (higher = more dangerous)
    """

    # Base thresholds (for general population)
    thresholds = {
        'general': {
            'low': 32,
            'medium': 40
        },
        'elderly': {
            'low': 30,     # More sensitive
            'medium': 36
        },
        'outdoor_worker': {
            'low': 34,     # Slightly higher tolerance
            'medium': 42
        }
    }

    # Get thresholds for profile (default to general if unknown)
    profile_thresholds = thresholds.get(profile, thresholds['general'])

    # Classify risk
    if heat_index < profile_thresholds['low']:
        risk_level = 'LOW'
        # Score: 0-30
        risk_score = int((heat_index / profile_thresholds['low']) * 30)

    elif heat_index < profile_thresholds['medium']:
        risk_level = 'MEDIUM'
        # Score: 30-70
        range_size = profile_thresholds['medium'] - profile_thresholds['low']
        position = heat_index - profile_thresholds['low']
        risk_score = 30 + int((position / range_size) * 40)

    else:
        risk_level = 'HIGH'
        # Score: 70-100
        excess = heat_index - profile_thresholds['medium']
        risk_score = min(100, 70 + int(excess * 2))

    return risk_level, risk_score


def get_risk_recommendation(risk_level: str, profile: str = 'general') -> str:
    """
    Get recommendation message based on risk level

    Args:
        risk_level: 'LOW', 'MEDIUM', 'HIGH'
        profile: User profile

    Returns:
        Recommendation text in Thai
    """

    recommendations = {
        'LOW': {
            'general': 'ปลอดภัย สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ',
            'elderly': 'ปลอดภัย แต่ควรดื่มน้ำเป็นประจำ',
            'outdoor_worker': 'ปลอดภัย ทำงานได้ตามปกติ'
        },
        'MEDIUM': {
            'general': 'ควรระวัง หลีกเลี่ยงกิจกรรมหนักในช่วง 12:00-15:00',
            'elderly': 'อันตรายปานกลาง ควรอยู่ในที่ร่มและดื่มน้ำบ่อยๆ',
            'outdoor_worker': 'ควรพักในที่ร่มทุก 1 ชั่วโมง และดื่มน้ำ 2-3 แก้ว/ชม.'
        },
        'HIGH': {
            'general': 'อันตรายสูง! ควรอยู่ในที่ร่มและมีแอร์',
            'elderly': 'อันตรายมาก! ห้ามออกกลางแจ้ง หากมีอาการผิดปกติให้โทร 1669',
            'outdoor_worker': 'อันตรายมาก! หยุดทำงานและไปยังจุดพักร้อนทันที'
        }
    }

    return recommendations.get(risk_level, {}).get(profile, recommendations[risk_level]['general'])
