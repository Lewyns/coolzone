"""
Hazard Points API Routes
"""

from flask import Blueprint, request, jsonify
import json
import os
import math

hazard_points_bp = Blueprint('hazard_points', __name__)

# Path to data file
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data', 'processed', 'hazard_points.json')


def haversine_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two points using Haversine formula

    Args:
        lat1, lng1: First point coordinates
        lat2, lng2: Second point coordinates

    Returns:
        Distance in meters
    """
    R = 6371000  # Earth radius in meters

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)

    a = math.sin(delta_lat/2)**2 + \
        math.cos(lat1_rad) * math.cos(lat2_rad) * \
        math.sin(delta_lng/2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c


def format_distance(distance_meters):
    """Format distance for display"""
    if distance_meters >= 1000:
        return f"{distance_meters/1000:.2f} km"
    else:
        return f"{int(distance_meters)} m"


@hazard_points_bp.route('/hazard-points', methods=['GET'])
def get_hazard_points():
    """
    Get hazard points (high heat risk areas) near user location

    Query Parameters:
        lat (float): User latitude
        lng (float): User longitude
        radius (int): Search radius in meters (default: 5000)
        risk_level (str): Filter by risk level ('low', 'medium', 'high')

    Returns:
        JSON: List of hazard points sorted by distance
    """
    try:
        # Get parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', default=5000, type=int)
        risk_level = request.args.get('risk_level', default=None, type=str)

        # Validate coordinates
        if lat is None or lng is None:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters: lat, lng',
                'code': 'MISSING_PARAMS'
            }), 400

        # Load hazard points data
        if not os.path.exists(DATA_FILE):
            return jsonify({
                'status': 'error',
                'message': 'Hazard points data not found',
                'code': 'DATA_NOT_FOUND'
            }), 500

        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            points = json.load(f)

        # Calculate distance for each point
        for point in points:
            distance = haversine_distance(
                lat, lng,
                point['lat'], point['lng']
            )
            point['distance'] = round(distance)
            point['distance_text'] = format_distance(distance)

        # Filter by risk level if specified
        if risk_level:
            points = [p for p in points if p['risk_level'] == risk_level]

        # Filter by radius
        points = [p for p in points if p['distance'] <= radius]

        # Sort by distance
        points.sort(key=lambda x: x['distance'])

        return jsonify({
            'status': 'success',
            'data': {
                'hazard_points': points,
                'total': len(points),
                'radius': radius,
                'user_location': {
                    'lat': lat,
                    'lng': lng
                }
            }
        }), 200

    except Exception as e:
        print(f"Error in hazard points endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500
