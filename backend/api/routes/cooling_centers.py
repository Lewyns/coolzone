"""
Cooling Centers API Routes
"""

from flask import Blueprint, request, jsonify
import json
import os
import math

cooling_centers_bp = Blueprint('cooling_centers', __name__)

# Path to data file
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data', 'processed', 'cooling_centers.json')


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


@cooling_centers_bp.route('/cooling-centers', methods=['GET'])
def get_cooling_centers():
    """
    Get cooling centers near user location

    Query Parameters:
        lat (float): User latitude
        lng (float): User longitude
        radius (int): Search radius in meters (default: 5000)
        limit (int): Maximum number of results (default: 10)
        type (str): Filter by type ('free' or 'paid')

    Returns:
        JSON: List of cooling centers sorted by distance
    """
    try:
        # Get parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', default=5000, type=int)
        limit = request.args.get('limit', default=10, type=int)
        filter_type = request.args.get('type', default=None, type=str)

        # Validate coordinates
        if lat is None or lng is None:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters: lat, lng',
                'code': 'MISSING_PARAMS'
            }), 400

        # Load cooling centers data
        if not os.path.exists(DATA_FILE):
            return jsonify({
                'status': 'error',
                'message': 'Cooling centers data not found',
                'code': 'DATA_NOT_FOUND'
            }), 500

        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            centers = json.load(f)

        # Calculate distance for each center
        for center in centers:
            distance = haversine_distance(
                lat, lng,
                center['lat'], center['lng']
            )
            center['distance'] = round(distance)
            center['distance_text'] = format_distance(distance)

        # Filter by type if specified
        if filter_type:
            centers = [c for c in centers if c['type'] == filter_type]

        # Filter by radius
        centers = [c for c in centers if c['distance'] <= radius]

        # Sort by distance
        centers.sort(key=lambda x: x['distance'])

        # Limit results
        centers = centers[:limit]

        return jsonify({
            'status': 'success',
            'data': {
                'centers': centers,
                'total': len(centers),
                'radius': radius,
                'user_location': {
                    'lat': lat,
                    'lng': lng
                }
            }
        }), 200

    except Exception as e:
        print(f"Error in cooling centers endpoint: {e}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500
