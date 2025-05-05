#!/usr/bin/env python3
# app.py

from flask import Flask, render_template, request
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def bmi_calculator():
    bmi = None
    category = None
    
    if request.method == 'POST':
        try:
            weight = float(request.form['weight'])
            height = float(request.form['height'])
            
            # Calculate BMI (weight in kg / height in meters squared)
            bmi = round(weight / (height/100)**2, 1)
            
            # Determine BMI category
            if bmi < 18.5:
                category = "Underweight"
            elif 18.5 <= bmi < 25:
                category = "Normal weight"
            elif 25 <= bmi < 30:
                category = "Overweight"
            else:
                category = "Obese"
                
        except (ValueError, ZeroDivisionError):
            bmi = None
            category = "Invalid input. Please enter valid numbers."
    
    return render_template('index.html', bmi=bmi, category=category)

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
        
    # Create the template file
    with open('templates/index.html', 'w') as f:
        f.write('''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BMI Calculator</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }
        button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            width: 100%;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #2980b9;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }
        .underweight { background-color: #AED6F1; }
        .normal { background-color: #A9DFBF; }
        .overweight { background-color: #FAD7A0; }
        .obese { background-color: #F5B7B1; }
        .error { background-color: #fadbd8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>BMI Calculator</h1>
        
        <form method="POST">
            <div class="form-group">
                <label for="weight">Weight (in kg):</label>
                <input type="number" id="weight" name="weight" step="0.1" min="0" required>
            </div>
            
            <div class="form-group">
                <label for="height">Height (in cm):</label>
                <input type="number" id="height" name="height" step="0.1" min="0" required>
            </div>
            
            <button type="submit">Calculate BMI</button>
        </form>
        
        {% if bmi %}
            <div class="result 
                {% if category == 'Underweight' %}underweight
                {% elif category == 'Normal weight' %}normal
                {% elif category == 'Overweight' %}overweight
                {% elif category == 'Obese' %}obese
                {% else %}error{% endif %}">
                
                {% if "Invalid" in category %}
                    <p>{{ category }}</p>
                {% else %}
                    <h3>Your BMI: {{ bmi }}</h3>
                    <p>Category: {{ category }}</p>
                {% endif %}
            </div>
        {% endif %}
    </div>
</body>
</html>''')
    
    app.run(debug=True, host='0.0.0.0')
