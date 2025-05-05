# Student Registration Application

A simple AngularJS application that demonstrates the use of ng-controller, ng-model, and expressions for registering students and displaying their information.

## Project Files

- `index.html` - Main HTML file with Angular directives
- `app.js` - Angular controller and application logic
- `styles.css` - Custom styling for the application

## Features

- Student registration form with validation
- Real-time preview of entered data using Angular expressions
- Table displaying all registered students
- Responsive design using Bootstrap

## Angular Concepts Used

- **ng-app**: Initializes the Angular application
- **ng-controller**: Attaches the controller to the DOM
- **ng-model**: Two-way data binding between the form and controller
- **ng-submit**: Handles form submissions
- **ng-show/ng-if**: Conditionally displays elements
- **ng-repeat**: Creates a list of elements from an array
- **Expressions**: Display data from the controller using {{ }} syntax

## How to Run on Ubuntu

### Method 1: Using Python HTTP Server

1. Open Terminal
2. Navigate to the project directory:
   ```
   cd path/to/student-registration-app
   ```
3. Start a simple HTTP server:
   ```
   python3 -m http.server 8000
   ```
4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

### Method 2: Using Node.js HTTP Server

1. Make sure Node.js is installed:
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
   cd path/to/student-registration-app
   ```
5. Start the server:
   ```
   http-server
   ```
6. Open your browser and go to:
   ```
   http://localhost:8080
   ```

### Method 3: Using VSCode Live Server Extension

1. Install Visual Studio Code if not already installed:
   ```
   sudo snap install code --classic
   ```
2. Open the project in VSCode:
   ```
   code path/to/student-registration-app
   ```
3. Install the "Live Server" extension from the Extensions marketplace
4. Right-click on `index.html` and select "Open with Live Server"

## Dependencies

- AngularJS v1.8.2 (loaded from CDN)
- Bootstrap v5.2.3 (loaded from CDN)

## Screenshots

The application consists of:
1. A registration form to input student details
2. A preview section showing the entered details
3. A table listing all registered students
