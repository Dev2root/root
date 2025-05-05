# AJAX User Validation System

This project demonstrates a client-side user registration form with AJAX validation. It simulates server-side validation by checking user inputs in real-time and showing validation results on the same page.

## Project Files

- `index.html` - Main HTML file containing the registration form and results container
- `styles.css` - CSS styles for the application
- `script.js` - JavaScript/jQuery code implementing the AJAX validation logic

## Features

1. **Real-time Field Validation**:
   - Username validation (availability check, format validation)
   - Email validation (format check, availability check)
   - Password strength evaluation
   - Mobile number validation (Indian format)

2. **Simulated AJAX Requests**:
   - Delayed validation to simulate server communication
   - Loading indicators during validation
   - Real-time feedback on field blur events

3. **Form Submission**:
   - Comprehensive validation on submit
   - Results displayed below the form
   - Detailed feedback with color-coded indicators
   - No page refresh required

## How It Works

1. When a user enters information and moves to the next field (blur event), the system validates that field with a simulated AJAX request.
2. Visual feedback is immediately shown beside each field.
3. On form submission, a comprehensive validation is performed and results are displayed below the submit button.
4. The validation simulates checking against existing data (usernames and emails) stored in the script.

## Input Validation Rules

- **Username**: Must be at least 5 characters, contain only letters, numbers, dots and underscores, and must be unique
- **Email**: Must be in valid email format and not already registered
- **Password**: Evaluated for strength based on length, and presence of lowercase, uppercase, numbers, and special characters
- **Mobile**: Must be a valid 10-digit Indian mobile number starting with 6-9

## How to Run on Ubuntu

### Method 1: Using Python's HTTP Server

1. Open Terminal
2. Navigate to the project directory:
   ```
   cd path/to/ajax-user-validation
   ```
3. Start a Python HTTP server:
   ```
   python3 -m http.server 8000
   ```
4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

### Method 2: Using Node.js HTTP Server

1. Ensure Node.js is installed:
   ```
   node -v
   ```
2. If not installed, install Node.js:
   ```
   sudo apt update
   sudo apt install nodejs npm
   ```
3. Install http-server globally:
   ```
   sudo npm install -g http-server
   ```
4. Navigate to the project directory:
   ```
   cd path/to/ajax-user-validation
   ```
5. Start the server:
   ```
   http-server
   ```
6. Open your browser and go to:
   ```
   http://localhost:8080
   ```

## Dependencies

- jQuery 3.6.4 (loaded from CDN)
- Bootstrap 5.2.3 CSS (loaded from CDN)

## Notes

This implementation simulates server-side validation on the client-side using JavaScript timeouts. In a real application, you would make actual AJAX calls to a backend server that handles the validation logic and database checks.