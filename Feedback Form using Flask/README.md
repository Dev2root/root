# Design Feedback Form Application

A simple, elegant Flask web application for collecting and managing design feedback with excellent UI/UX.

## Features

- User-friendly feedback form with multiple input fields
- Rating system for design evaluations
- Storage of feedback in JSON format
- View all submitted feedback with detailed information
- Responsive design that works on all devices
- Clean and modern UI with Bootstrap 5

## Project Structure

```
design_feedback_app/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── feedback_data/            # Directory for storing feedback JSON files (created automatically)
└── templates/
    ├── base.html             # Base template with shared layout
    ├── index.html            # Feedback form page
    ├── thank_you.html        # Thank you confirmation page
    └── view_feedback.html    # Page to view all feedback
```

## Installation and Setup Instructions for Ubuntu

1. Clone the repository or download the files to your local machine:

```bash
git clone <repository-url>
# OR create directories and files manually
mkdir -p design_feedback_app/templates
# Copy each file to the appropriate location
```

2. Navigate to the project directory:

```bash
cd design_feedback_app
```

3. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

4. Install the required dependencies:

```bash
pip install -r requirements.txt
```

5. Run the application:

```bash
python3 app.py
```

6. Open your web browser and navigate to:

```
http://127.0.0.1:5000/
```

## Usage

1. Fill out the feedback form on the home page with design evaluation details
2. Submit the form to save the feedback
3. View all feedback submissions by clicking on "View Feedback" in the navigation bar
4. Click on "View Details" for any feedback entry to see full feedback information

## Data Storage

All feedback is stored as individual JSON files in the `feedback_data` directory. Each file is named with a timestamp and submitter's name for easy identification.


echo "# web" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Dev2root/web.git
git push -u origin main