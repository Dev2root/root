from flask import Flask, render_template, request, redirect, url_for, flash
import os
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'design_feedback_secret_key'

# Ensure the data directory exists
DATA_DIR = 'feedback_data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_feedback():
    feedback = {
        'name': request.form.get('name', 'Anonymous'),
        'email': request.form.get('email', ''),
        'design_type': request.form.get('design_type', ''),
        'rating': request.form.get('rating', ''),
        'strengths': request.form.get('strengths', ''),
        'improvements': request.form.get('improvements', ''),
        'additional_comments': request.form.get('additional_comments', ''),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Save feedback to a JSON file with timestamp
    filename = f"{DATA_DIR}/feedback_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{feedback['name'].replace(' ', '_')}.json"
    with open(filename, 'w') as f:
        json.dump(feedback, f, indent=4)
    
    flash('Thank you for your feedback!', 'success')
    return redirect(url_for('thank_you'))

@app.route('/thank-you')
def thank_you():
    return render_template('thank_you.html')

@app.route('/view-feedback')
def view_feedback():
    feedbacks = []
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            with open(os.path.join(DATA_DIR, filename), 'r') as f:
                feedbacks.append(json.load(f))
    
    # Sort feedbacks by timestamp (newest first)
    feedbacks.sort(key=lambda x: x['timestamp'], reverse=True)
    return render_template('view_feedback.html', feedbacks=feedbacks)

if __name__ == '__main__':
    app.run(debug=True)