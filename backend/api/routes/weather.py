"""
Weather API Routes
"""

from flask import Blueprint, request, jsonify
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from services.weather_service import WeatherService
from models.heat import calculate_heat_index, classify_risk, get_risk_message

weather_bp = Blueprint('weather', __name__)

# Initialize weather service
weather_service = WeatherService()


@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    """
    Get current weather and heat risk assessment

    Query Parameters:
        lat (float): Latitude
        lng (float): Longitude
        profile (str): User profile ('general', 'elderly', 'outdoor_worker')

    Returns:
        JSON: Weather data with heat risk assessment
    """
    try:
        # Get parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        profile = request.args.get('profile', 'general')

        # Validate coordinates
        if lat is None or lng is None:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters: lat, lng',
                'code': 'MISSING_PARAMS'
            }), 400

        # Validate coordinate ranges
        is_valid, error_message = weather_service.validate_coordinates(lat, lng)
        if not is_valid:
            return jsonify({
                'status': 'error',
                'message': error_message,
                'code': 'INVALID_COORDINATES'
            }), 400

        # Fetch weather data
        weather_data = weather_service.get_current_weather(lat, lng)

        if not weather_data:
            return jsonify({
                'status': 'error',
                'message': 'Failed to fetch weather data',
                'code': 'API_ERROR'
            }), 500

        # Calculate Heat Index
        try:
            heat_index = calculate_heat_index(
                weather_data['temperature'],
                weather_data['humidity']
            )
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e),
                'code': 'CALCULATION_ERROR'
            }), 400

        # Classify risk level
        risk_level = classify_risk(heat_index, profile)
        risk_info = get_risk_message(risk_level)

        # Build response
        response = {
            'status': 'success',
            'data': {
                'location': {
                    'lat': lat,
                    'lng': lng,
                    'name': weather_data['location_name']
                },
                'weather': {
                    'temperature': weather_data['temperature'],
                    'feels_like': weather_data['feels_like'],
                    'humidity': weather_data['humidity'],
                    'wind_speed': weather_data['wind_speed'],
                    'description': weather_data['description'],
                    'icon': weather_data['icon'],
                    'clouds': weather_data['clouds']
                },
                'heat_index': heat_index,
                'risk_level': risk_level,
                'risk_info': risk_info,
                'sun': {
                    'sunrise': weather_data['sunrise'],
                    'sunset': weather_data['sunset']
                },
                'timestamp': weather_data['timestamp']
            }
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500


@weather_bp.route('/forecast', methods=['GET'])
def get_forecast():
    """
    Get weather forecast with heat risk for next N hours

    Query Parameters:
        lat (float): Latitude
        lng (float): Longitude
        hours (int): Number of hours (default: 6)
        profile (str): User profile

    Returns:
        JSON: Forecast data with heat risk for each period
    """
    try:
        # Get parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        hours = request.args.get('hours', default=6, type=int)
        profile = request.args.get('profile', 'general')

        # Validate
        if lat is None or lng is None:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters: lat, lng'
            }), 400

        is_valid, error_message = weather_service.validate_coordinates(lat, lng)
        if not is_valid:
            return jsonify({
                'status': 'error',
                'message': error_message
            }), 400

        # Fetch forecast
        forecast_data = weather_service.get_forecast(lat, lng, hours)

        if not forecast_data:
            return jsonify({
                'status': 'error',
                'message': 'Failed to fetch forecast data'
            }), 500

        # Add heat risk to each forecast item
        forecast_with_risk = []
        for item in forecast_data:
            heat_index = calculate_heat_index(item['temperature'], item['humidity'])
            risk_level = classify_risk(heat_index, profile)

            forecast_with_risk.append({
                **item,
                'heat_index': heat_index,
                'risk_level': risk_level
            })

        return jsonify({
            'status': 'success',
            'data': {
                'forecast': forecast_with_risk
            }
        }), 200

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


@weather_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Weather API is running',
        'api_configured': bool(os.getenv('OPENWEATHER_API_KEY'))
    }), 200
