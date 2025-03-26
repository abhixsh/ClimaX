from flask import Flask, jsonify
import requests

app = Flask(__name__)

API_KEY = "d276db356d47594c97cd55c5b02b05a7"

@app.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
