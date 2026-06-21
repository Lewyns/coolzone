"""
Weather Service - OpenWeatherMap API Integration
"""

import os
import requests
from datetime import datetime

class WeatherService:
    """Service for fetching weather data from OpenWeatherMap API"""

    def __init__(self):
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.base_url = 'https://api.openweathermap.org/data/2.5'

        if not self.api_key:
            raise ValueError('OPENWEATHER_API_KEY not found in environment variables')

    def get_current_weather(self, lat, lng):
        """
        Get current weather data for given coordinates

        Args:
            lat (float): Latitude
            lng (float): Longitude

        Returns:
            dict: Weather data or None if error
        """
        try:
            url = f"{self.base_url}/weather"
            params = {
                'lat': lat,
                'lon': lng,
                'appid': self.api_key,
                'units': 'metric',
                'lang': 'th'
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()

            # Extract relevant data
            weather_data = {
                'temperature': round(data['main']['temp'], 1),
                'feels_like': round(data['main']['feels_like'], 1),
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'wind_speed': round(data['wind']['speed'], 1),
                'wind_direction': data['wind'].get('deg', 0),
                'clouds': data['clouds']['all'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
                'location_name': data.get('name', 'Unknown'),
                'timestamp': datetime.now().isoformat()
            }

            return weather_data

        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None
        except (KeyError, ValueError) as e:
            print(f"Error parsing weather data: {e}")
            return None

    def get_forecast(self, lat, lng, hours=6):
        """
        Get weather forecast for next N hours

        Args:
            lat (float): Latitude
            lng (float): Longitude
            hours (int): Number of hours to forecast (default: 6)

        Returns:
            list: Forecast data for each period
        """
        try:
            url = f"{self.base_url}/forecast"
            params = {
                'lat': lat,
                'lon': lng,
                'appid': self.api_key,
                'units': 'metric',
                'lang': 'th',
                'cnt': min(hours // 3 + 1, 8)  # API returns 3-hour intervals
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()

            forecast = []
            for item in data['list'][:hours]:
                forecast_item = {
                    'time': datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
                    'timestamp': item['dt'],
                    'temperature': round(item['main']['temp'], 1),
                    'humidity': item['main']['humidity'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'wind_speed': round(item['wind']['speed'], 1),
                    'clouds': item['clouds']['all']
                }
                forecast.append(forecast_item)

            return forecast

        except requests.exceptions.RequestException as e:
            print(f"Error fetching forecast data: {e}")
            return []
        except (KeyError, ValueError) as e:
            print(f"Error parsing forecast data: {e}")
            return []

    def validate_coordinates(self, lat, lng):
        """
        Validate latitude and longitude

        Args:
            lat (float): Latitude
            lng (float): Longitude

        Returns:
            tuple: (is_valid, error_message)
        """
        if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
            return False, "Coordinates must be numbers"

        if not (-90 <= lat <= 90):
            return False, f"Latitude {lat} is out of range (-90 to 90)"

        if not (-180 <= lng <= 180):
            return False, f"Longitude {lng} is out of range (-180 to 180)"

        return True, None
