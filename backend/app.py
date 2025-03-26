import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API key from environment variable
API_KEY = os.getenv('OPENWEATHERMAP_API_KEY')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    
    if not city:
        return jsonify({
            'error': 'City parameter is required',
            'status': 400
        }), 400
    
    try:
        # Fetch current weather
        current_weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        current_response = requests.get(current_weather_url)
        current_data = current_response.json()
        
        # Check if city is found
        if current_response.status_code != 200:
            return jsonify({
                'error': 'City not found',
                'status': 404
            }), 404
        
        # Fetch forecast data
        forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()
        
        # Prepare comprehensive weather data
        weather_info = {
            'current': {
                'temp': current_data['main']['temp'],
                'feels_like': current_data['main']['feels_like'],
                'humidity': current_data['main']['humidity'],
                'wind_speed': current_data['wind']['speed'],
                'description': current_data['weather'][0]['description'],
                'main': current_data['weather'][0]['main'],
                'icon': current_data['weather'][0]['icon']
            },
            'location': {
                'name': current_data['name'],
                'country': current_data['sys']['country']
            },
            'forecast': [
                {
                    'date': item['dt_txt'],
                    'temp': item['main']['temp'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                } for item in forecast_data['list'][:5]  # Next 5 forecast points
            ]
        }
        
        return jsonify(weather_info), 200
    
    except requests.RequestException as e:
        return jsonify({
            'error': 'Unable to fetch weather data',
            'details': str(e),
            'status': 500
        }), 500
    except KeyError as e:
        return jsonify({
            'error': 'Incomplete weather data',
            'details': str(e),
            'status': 500
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Weather API is running'
    }), 200

if __name__ == '__main__':
    # Ensure API key is set
    if not API_KEY:
        print("ERROR: OPENWEATHERMAP_API_KEY not set in environment variables")
        exit(1)
    
    app.run(debug=True, host='0.0.0.0', port=5000)