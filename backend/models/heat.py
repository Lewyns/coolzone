"""
Heat Index Calculator using NOAA Formula
Reference: https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
"""

def celsius_to_fahrenheit(celsius):
    """Convert Celsius to Fahrenheit"""
    return (celsius * 9/5) + 32

def fahrenheit_to_celsius(fahrenheit):
    """Convert Fahrenheit to Celsius"""
    return (fahrenheit - 32) * 5/9

def calculate_heat_index(temperature, humidity):
    """
    Calculate Heat Index using NOAA Regression Formula

    Args:
        temperature (float): Temperature in Celsius
        humidity (float): Relative humidity (0-100)

    Returns:
        float: Heat Index in Celsius

    Raises:
        ValueError: If inputs are out of valid range
    """
    # Validate inputs
    if not (-50 <= temperature <= 60):
        raise ValueError(f"Temperature {temperature}°C is out of valid range (-50 to 60°C)")

    if not (0 <= humidity <= 100):
        raise ValueError(f"Humidity {humidity}% is out of valid range (0-100%)")

    # Convert to Fahrenheit for NOAA formula
    temp_f = celsius_to_fahrenheit(temperature)

    # If temperature is below 80°F (27°C), Heat Index = Temperature
    if temp_f < 80:
        return temperature

    # NOAA Regression Formula (Rothfusz regression)
    # HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH - 0.00683783*T^2
    #      - 0.05481717*RH^2 + 0.00122874*T^2*RH + 0.00085282*T*RH^2 - 0.00000199*T^2*RH^2

    T = temp_f
    RH = humidity

    heat_index_f = (
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

    # Adjustments for specific conditions
    # If RH < 13% and temperature between 80-112°F
    if RH < 13 and 80 <= T <= 112:
        adjustment = ((13 - RH) / 4) * ((17 - abs(T - 95)) / 17) ** 0.5
        heat_index_f -= adjustment

    # If RH > 85% and temperature between 80-87°F
    elif RH > 85 and 80 <= T <= 87:
        adjustment = ((RH - 85) / 10) * ((87 - T) / 5)
        heat_index_f += adjustment

    # Convert back to Celsius
    heat_index_c = fahrenheit_to_celsius(heat_index_f)

    return round(heat_index_c, 1)


def classify_risk(heat_index, user_profile='general'):
    """
    Classify heat risk level based on Heat Index and user profile

    Args:
        heat_index (float): Heat Index in Celsius
        user_profile (str): 'general', 'elderly', or 'outdoor_worker'

    Returns:
        str: Risk level ('LOW', 'MEDIUM', 'HIGH')
    """
    # Risk thresholds for different user profiles
    thresholds = {
        'general': {
            'medium': 32,  # 90°F
            'high': 40     # 104°F
        },
        'elderly': {
            'medium': 28,  # Lower threshold for elderly
            'high': 35
        },
        'outdoor_worker': {
            'medium': 30,  # Lower threshold for workers
            'high': 38
        }
    }

    # Get thresholds for user profile (default to general)
    profile_thresholds = thresholds.get(user_profile, thresholds['general'])

    if heat_index < profile_thresholds['medium']:
        return 'LOW'
    elif heat_index < profile_thresholds['high']:
        return 'MEDIUM'
    else:
        return 'HIGH'


def get_risk_message(risk_level):
    """
    Get risk message and recommendations

    Args:
        risk_level (str): 'LOW', 'MEDIUM', or 'HIGH'

    Returns:
        dict: Message and recommendations
    """
    messages = {
        'LOW': {
            'message': 'ปลอดภัย - สามารถทำกิจกรรมกลางแจ่งได้',
            'recommendations': [
                '💧 ดื่มน้ำเป็นประจำ',
                '🧢 สวมหมวกป้องกันแดด',
                '☀️ ใช้ครีมกันแดด'
            ],
            'color': 'green'
        },
        'MEDIUM': {
            'message': 'ระวัง - ควรจำกัดกิจกรรมกลางแจ้ง',
            'recommendations': [
                '💧 ดื่มน้ำบ่อยๆ',
                '🌳 หาที่ร่ม',
                '⏱️ หลีกเลี่ยงช่วง 11:00-15:00',
                '👕 สวมเสื้อผ้าโปร่ง'
            ],
            'color': 'yellow'
        },
        'HIGH': {
            'message': 'อันตราย - หลีกเลี่ยงกิจกรรมกลางแจ้ง',
            'recommendations': [
                '🏠 อยู่ในที่ร่มที่มีแอร์',
                '💧 ดื่มน้ำมากๆ',
                '🚫 หลีกเลี่ยงกิจกรรมหนัก',
                '🏥 สังเกตอาการวิงเวียน คลื่นไส้',
                '❄️ หาจุดพักร้อนใกล้เคียง'
            ],
            'color': 'red'
        }
    }

    return messages.get(risk_level, messages['LOW'])
