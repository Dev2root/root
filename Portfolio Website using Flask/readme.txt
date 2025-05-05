# Portfolio Website with Flask

A clean, responsive portfolio website built with Flask, featuring a modern UI/UX design. This application allows you to showcase your projects, skills, and provides contact functionality.

## Features

- Responsive design using Bootstrap 5
- Home page with hero section, about me, and portfolio showcase
- Detailed project pages for each portfolio item
- Contact form with validation
- Simple admin panel to add new projects
- Customizable skills and portfolio items
- Smooth animations and transitions

## Project Structure

```
portfolio-website/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/             # Static assets
│   ├── css/
│   │   └── style.css   # Custom CSS styles
│   ├── js/
│   │   └── main.js     # Custom JavaScript
│   └── img/            # Images for the website
│       └── portfolio/  # Portfolio project images
├── templates/          # HTML templates
│   ├── base.html       # Base template (layout)
│   ├── index.html      # Home page
│   ├── project_detail.html  # Project details page
│   ├── contact.html    # Contact page
│   └── admin.html      # Admin panel
└── README.md           # This file
```

## Prerequisites

- Python 3.8 or higher
- Flask 2.3.x

## Installation

1. Clone this repository or download the code

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create necessary directories:
   ```
   mkdir -p static/img/portfolio
   ```

5. Add placeholder images to `static/img/`:
   - Add a profile image named `profile.jpg`
   - Add a hero background image named `hero-bg.jpg`
   - Add portfolio project images in the `portfolio` folder

## Running the Application

```
python app.py
```

Then open your browser and navigate to `http://127.0.0.1:5000/`

## Customization

1. Edit the `about_me` dictionary in `app.py` to update your personal information.
2. Modify the `portfolio_items` list to add or remove projects.
3. Update the CSS in `static/css/style.css` to change colors, fonts, and other styling.
4. Replace the placeholder images with your own.

## Deployment

For production deployment:

1. Set the secret key properly in `app.py`:
   ```python
   app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')
   ```

2. Disable debug mode:
   ```python
   app.run(debug=False)
   ```

3. Consider using a production WSGI server like Gunicorn:
   ```
   pip install gunicorn
   gunicorn app:app
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
