# Student Record Management System

A comprehensive student record management system built with React frontend and Express/PostgreSQL backend, compatible with Ubuntu systems.

## Installation on Ubuntu

Follow these steps to set up the application on an Ubuntu system:

### 1. Install Required Software

```bash
# Update package lists
sudo apt update

# Install Node.js and npm 
sudo apt install -y nodejs npm

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Git
sudo apt install -y git
```

### 2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/student-record-management.git

# Navigate to the project directory
cd student-record-management
```

### 3. Set Up PostgreSQL Database

```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Connect to PostgreSQL
sudo -u postgres psql

# Inside PostgreSQL shell, create a database and user
CREATE DATABASE student_records;
CREATE USER studentapp WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE student_records TO studentapp;

# Exit PostgreSQL shell
\q
```

### 4. Configure Environment Variables

Create a `.env` file in the root of the project with the following content:

```
DATABASE_URL=postgres://studentapp:your_password@localhost:5432/student_records
PORT=5000
```

### 5. Install Dependencies and Run the Application

```bash
# Install dependencies
npm install

# Create database schema and seed data
npm run db:push
npm run db:seed

# Start the application
npm run dev
```

The application should now be running at http://localhost:5000

## Features

- **Students Management**: Add, edit, delete, and view student records
- **Courses Management**: Manage course offerings
- **Grades Tracking**: Track student grades
- **Attendance Tracking**: Monitor student attendance
- **Reporting**: Generate various reports on student data
- **Settings**: Configure application settings

## System Requirements

- Ubuntu 20.04 or newer
- Node.js 16 or newer
- PostgreSQL 12 or newer
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check the following:

1. Ensure PostgreSQL service is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify your database credentials in the `.env` file

3. Test database connection:
   ```bash
   psql -U studentapp -h localhost -d student_records
   ```

### Application Not Starting

1. Check for errors in the console
2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
3. Verify that the required ports are not in use by other applications

### Performance Issues

If the application is running slowly:

1. Optimize your PostgreSQL database:
   ```bash
   sudo -u postgres vacuumdb --all --analyze
   ```

2. Check system resources (CPU, memory) usage

## Support

For additional help, please contact support@example.com