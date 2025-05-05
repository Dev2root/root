#!/usr/bin/env python3
# app.py

from flask import Flask, render_template, request, redirect, url_for, flash
import os
from werkzeug.utils import secure_filename
from datetime import datetime


app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for flash messages

# Sample portfolio data - in a real application, you would use a database
portfolio_items = [
    {
        'id': 1,
        'title': 'Project One',
        'category': 'Web Design',
        'image': 'project1.jpg',
        'description': 'A responsive website built with Flask and Bootstrap.',
        'link': '#'
    },
    {
        'id': 2,
        'title': 'Project Two',
        'category': 'Mobile App',
        'image': 'project2.jpg',
        'description': 'A cross-platform mobile application developed with React Native.',
        'link': '#'
    },
    {
        'id': 3,
        'title': 'Project Three',
        'category': 'UI/UX Design',
        'image': 'project3.jpg',
        'description': 'Redesign of a major e-commerce platform focusing on user experience.',
        'link': '#'
    },
    {
        'id': 4,
        'title': 'Project Four',
        'category': 'Web Development',
        'image': 'project4.jpg',
        'description': 'A full-stack web application with user authentication and database integration.',
        'link': '#'
    }
]

# About me information
about_me = {
    'name': 'Your Name',
    'title': 'Web Developer & UI/UX Designer',
    'bio': 'A passionate web developer with expertise in creating responsive, user-friendly websites and applications. I specialize in frontend development with a strong focus on user experience.',
    'skills': ['HTML/CSS', 'JavaScript', 'Python', 'Flask', 'React', 'UI/UX Design', 'Responsive Design'],
    'email': 'your.email@example.com',
    'phone': '+1 (123) 456-7890',
    'social': {
        'github': 'https://github.com/yourusername',
        'linkedin': 'https://linkedin.com/in/yourusername',
        'twitter': 'https://twitter.com/yourusername'
    }
}


# Routes
@app.route('/')
def index():
    return render_template('index.html', 
                           portfolio_items=portfolio_items,
                           about=about_me,year=datetime.now().year,)

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    project = next((item for item in portfolio_items if item['id'] == project_id), None)
    if project:
        return render_template('project_detail.html', project=project, about=about_me)
    return redirect(url_for('index'))

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # In a real application, you would process the form data here
        # For example, send an email or save to a database
        
        flash('Thank you for your message! I will get back to you soon.')
        return redirect(url_for('index'))
    
    return render_template('contact.html', about=about_me)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    # Simple admin panel for demonstration purposes
    # In a real application, you would add authentication
    if request.method == 'POST':
        title = request.form.get('title')
        category = request.form.get('category')
        description = request.form.get('description')
        link = request.form.get('link')
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join('static/img/portfolio', filename))
                
                # Add new project to portfolio_items
                new_id = max(item['id'] for item in portfolio_items) + 1
                portfolio_items.append({
                    'id': new_id,
                    'title': title,
                    'category': category,
                    'image': filename,
                    'description': description,
                    'link': link
                })
                
                flash('Project added successfully!')
                return redirect(url_for('admin'))
    
    return render_template('admin.html', about=about_me, portfolio_items=portfolio_items)

if __name__ == '__main__':
    # Make sure the upload directory exists
    os.makedirs('static/img/portfolio', exist_ok=True)
    app.run(debug=True)
