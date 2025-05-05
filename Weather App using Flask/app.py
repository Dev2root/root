from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# API Key for WeatherStack (replace with your own key)
API_KEY = "25c87776247f9d1d426b8f16ce830600"
BASE_URL = "http://api.weatherstack.com/current?"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        city = request.form['city']
        if city:
            # Construct the URL to fetch data from the WeatherStack API using .format() instead of f-strings
            complete_url = "{}access_key={}&query={}".format(BASE_URL, API_KEY, city)
            
            # Make the API request
            response = requests.get(complete_url)
            data = response.json()
            
            if data.get('error'):
                # If city is not found or an error occurs
                message = "City not found. Please try again."
                return render_template('index.html', message=message)
            else:
                # Extract weather information from the response
                location = data['location']
                current = data['current']
                
                city_name = location['name']
                country = location['country']
                temperature = current['temperature']
                description = current['weather_descriptions'][0]
                pressure = current['pressure']
                humidity = current['humidity']
                wind_speed = current['wind_speed']
                
                # Return the weather information to the template
                return render_template('index.html', city=city_name, country=country,
                                       temperature=temperature, description=description, 
                                       pressure=pressure, humidity=humidity, wind_speed=wind_speed)

    # If no POST request, just render the empty form
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
