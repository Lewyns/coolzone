"""
Heat Map API Routes
API endpoints สำหรับ Heat Map Comparison
"""

from flask import Blueprint, request, jsonify
import json
import os
from models.heat_score import calculate_heat_score, get_heat_color, get_heat_emoji

heat_map_bp = Blueprint('heat_map', __name__)

# Load locations data - adjust path based on where app.py is run from
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
LOCATIONS_FILE = os.path.join(BASE_DIR, 'data', 'locations_extended.json')

print(f"DEBUG: Looking for locations file at: {LOCATIONS_FILE}")

def load_locations():
    """Load locations from JSON file"""
    try:
        with open(LOCATIONS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data['locations']
    except Exception as e:
        print(f"Error loading locations: {e}")
        return []


@heat_map_bp.route('/heat-map', methods=['GET'])
def get_heat_map():
    """
    Get heat map data with scores for all locations

    Query Parameters:
        lat (float, required): User latitude
        lng (float, required): User longitude
        type_filter (str, optional): Filter by type (indoor_ac, green_space, near_water, outdoor_shaded)
        radius (int, optional): Search radius in meters (default: 10000)

    Returns:
        {
            "status": "success",
            "data": {
                "locations": [
                    {
                        "id": 1,
                        "name": "...",
                        "type": "...",
                        "lat": 13.7308,
                        "lng": 100.5418,
                        "distance": 1234,
                        "heat_score": {
                            "score": 24,
                            "level": "cool",
                            "estimated_temp": 33.4,
                            "description": "...",
                            "color": "#90EE90",
                            "emoji": "🟢"
                        },
                        "details": {
                            "free": true,
                            "has_ac": false,
                            "activities": [...],
                            "pros": [...],
                            "cons": [...]
                        }
                    }
                ],
                "current_weather": {
                    "temperature": 35.0,
                    "humidity": 65
                }
            }
        }
    """
    try:
        # Get query parameters
        user_lat = request.args.get('lat', type=float)
        user_lng = request.args.get('lng', type=float)
        type_filter = request.args.get('type_filter', default='all')
        radius = request.args.get('radius', default=10000, type=int)

        if user_lat is None or user_lng is None:
            return jsonify({
                'status': 'error',
                'message': 'lat and lng parameters are required'
            }), 400

        # Load locations
        locations = load_locations()

        if not locations:
            return jsonify({
                'status': 'error',
                'message': 'Failed to load locations data'
            }), 500

        # Get current weather (you can fetch from weather API or use default)
        # For now, use mock data
        current_weather = {
            'temperature': 35.0,
            'humidity': 65
        }

        # Calculate heat scores and distances for all locations
        results = []
        for location in locations:
            # Filter by type
            if type_filter != 'all' and location['type'] != type_filter:
                continue

            # Calculate distance
            distance = calculate_distance(
                user_lat, user_lng,
                location['lat'], location['lng']
            )

            # Filter by radius
            if distance > radius:
                continue

            # Calculate heat score
            heat_result = calculate_heat_score(location, current_weather)

            # Build response
            results.append({
                'id': location['id'],
                'name': location['name'],
                'name_en': location.get('name_en', ''),
                'type': location['type'],
                'lat': location['lat'],
                'lng': location['lng'],
                'distance': round(distance, 0),
                'heat_score': {
                    'score': heat_result['score'],
                    'level': heat_result['level'],
                    'estimated_temp': heat_result['estimated_temp'],
                    'description': heat_result['description'],
                    'color': get_heat_color(heat_result['score']),
                    'emoji': get_heat_emoji(heat_result['score'])
                },
                'details': {
                    'free': location.get('free', True),
                    'has_ac': location.get('has_ac', False),
                    'has_water': location.get('has_water', False),
                    'surface': location.get('surface', 'concrete'),
                    'shade_level': location.get('shade_level', 0),
                    'activities': location.get('activities', []),
                    'pros': location.get('pros', []),
                    'cons': location.get('cons', [])
                }
            })

        # Sort by heat score (coolest first)
        results.sort(key=lambda x: x['heat_score']['score'])

        return jsonify({
            'status': 'success',
            'data': {
                'locations': results,
                'count': len(results),
                'current_weather': current_weather
            }
        })

    except Exception as e:
        print(f"Error in get_heat_map: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@heat_map_bp.route('/heat-map/compare', methods=['GET'])
def compare_locations():
    """
    Compare heat scores of specific locations

    Query Parameters:
        location_ids (str, required): Comma-separated location IDs (e.g., "1,2,3")

    Returns:
        {
            "status": "success",
            "data": {
                "comparison": [
                    {
                        "id": 1,
                        "name": "...",
                        "heat_score": {...},
                        "details": {...}
                    }
                ]
            }
        }
    """
    try:
        # Get location IDs
        location_ids_str = request.args.get('location_ids', '')

        if not location_ids_str:
            return jsonify({
                'status': 'error',
                'message': 'location_ids parameter is required'
            }), 400

        # Parse IDs
        try:
            location_ids = [int(id.strip()) for id in location_ids_str.split(',')]
        except ValueError:
            return jsonify({
                'status': 'error',
                'message': 'Invalid location_ids format'
            }), 400

        # Load locations
        locations = load_locations()

        # Get current weather
        current_weather = {
            'temperature': 35.0,
            'humidity': 65
        }

        # Find requested locations
        comparison = []
        for location in locations:
            if location['id'] in location_ids:
                heat_result = calculate_heat_score(location, current_weather)

                comparison.append({
                    'id': location['id'],
                    'name': location['name'],
                    'name_en': location.get('name_en', ''),
                    'type': location['type'],
                    'heat_score': {
                        'score': heat_result['score'],
                        'level': heat_result['level'],
                        'estimated_temp': heat_result['estimated_temp'],
                        'description': heat_result['description'],
                        'color': get_heat_color(heat_result['score']),
                        'emoji': get_heat_emoji(heat_result['score'])
                    },
                    'details': {
                        'free': location.get('free', True),
                        'has_ac': location.get('has_ac', False),
                        'activities': location.get('activities', []),
                        'pros': location.get('pros', []),
                        'cons': location.get('cons', [])
                    }
                })

        # Sort by heat score
        comparison.sort(key=lambda x: x['heat_score']['score'])

        return jsonify({
            'status': 'success',
            'data': {
                'comparison': comparison,
                'current_weather': current_weather
            }
        })

    except Exception as e:
        print(f"Error in compare_locations: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


def calculate_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two points using Haversine formula

    Returns:
        float: Distance in meters
    """
    from math import radians, sin, cos, sqrt, atan2

    R = 6371000  # Earth radius in meters

    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)
    delta_lat = radians(lat2 - lat1)
    delta_lng = radians(lng2 - lng1)

    a = sin(delta_lat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(delta_lng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    distance = R * c
    return distance
