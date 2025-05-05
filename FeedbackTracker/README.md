# Feedback System

A simple frontend-only feedback system built with React and shadcn/ui components. This application allows users to submit feedback and provides an admin interface to view and manage the collected feedback.

## Features

- User-friendly feedback submission form
- Star rating component
- Category classification
- Admin view with filtering and sorting capabilities
- Responsive design
- Data persistence using localStorage

## Installation

This application uses Node.js and npm. Make sure you have Node.js (version 16 or higher) installed on your system.

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/feedback-system.git
cd feedback-system
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:5000 (or the port specified in your environment).

## Usage

### Submitting Feedback

1. Navigate to the home page
2. Fill out the feedback form with your name, email, category, rating, and comments
3. Click "Submit Feedback"

### Viewing Feedback (Admin)

1. Click on "Admin View" in the navigation menu
2. Use the filters to sort and filter feedback by category, rating, or date
3. Click on the eye icon to view detailed feedback
4. Use the trash icon to delete feedback

## Project Structure

- `client/src/components/`: React components
- `client/src/pages/`: Page components
- `client/src/lib/`: Utility functions and hooks
- `client/src/hooks/`: Custom React hooks

## Running on Ubuntu

This application is compatible with Ubuntu and other Linux distributions. To run it on Ubuntu:

1. Install Node.js if you haven't already:

```bash
sudo apt update
sudo apt install nodejs npm
```

2. Verify the installation:

```bash
nodejs -v
npm -v
```

3. Follow the standard installation steps above (clone, install dependencies, start the server)

## Data Storage

This application uses localStorage for data persistence. All feedback is stored in the browser's localStorage under the key 'feedbackItems'.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.