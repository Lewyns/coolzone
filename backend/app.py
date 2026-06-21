"""
CoolZone Backend API
Flask Application
"""

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "file://*"  # Allow local file access
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Import routes
from api.routes.weather import weather_bp
from api.routes.cooling_centers import cooling_centers_bp
from api.routes.hazard_points import hazard_points_bp
from api.routes.heat_map import heat_map_bp

# Register blueprints
app.register_blueprint(weather_bp, url_prefix='/api')
app.register_blueprint(cooling_centers_bp, url_prefix='/api')
app.register_blueprint(hazard_points_bp, url_prefix='/api')
app.register_blueprint(heat_map_bp, url_prefix='/api')


@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'CoolZone API',
        'version': '1.1.0',
        'status': 'running',
        'endpoints': {
            'weather': '/api/weather?lat=<lat>&lng=<lng>&profile=<profile>',
            'forecast': '/api/forecast?lat=<lat>&lng=<lng>&hours=<hours>&profile=<profile>',
            'heat_map': '/api/heat-map?lat=<lat>&lng=<lng>&type_filter=<type>',
            'heat_compare': '/api/heat-map/compare?location_ids=<ids>',
            'health': '/api/health'
        }
    })


@app.route('/api')
def api_info():
    """API info endpoint"""
    return jsonify({
        'name': 'CoolZone API',
        'version': '1.0.0',
        'description': 'Urban Heat Decision Support Platform',
        'documentation': 'See README.md for API documentation'
    })


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found',
        'code': 'NOT_FOUND'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Internal server error',
        'code': 'INTERNAL_ERROR'
    }), 500


if __name__ == '__main__':
    # Set UTF-8 encoding for Windows console
    import sys
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # Check if API key is configured
    if not os.getenv('OPENWEATHER_API_KEY'):
        print("WARNING: OPENWEATHER_API_KEY not found!")
        print("Please create a .env file and add your API key")
        print("   Example: OPENWEATHER_API_KEY=your_key_here")
        print()

    # Run Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'

    print("=" * 50)
    print("CoolZone Backend API")
    print("=" * 50)
    print(f"Running on: http://localhost:{port}")
    print(f"Debug mode: {debug}")
    print(f"API Key configured: {bool(os.getenv('OPENWEATHER_API_KEY'))}")
    print("=" * 50)
    print()

    app.run(host='0.0.0.0', port=port, debug=debug)
