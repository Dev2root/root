# Ubuntu Installation Guide for Student Record Management System

This document provides detailed instructions for installing and running the Student Record Management System on Ubuntu systems.

## System Requirements

- Ubuntu 20.04 LTS or newer
- Minimum 2GB RAM
- 10GB free disk space
- Internet connection for downloading packages

## Step-by-Step Installation

### 1. Update Ubuntu System

First, make sure your Ubuntu system is up to date:

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js and npm

Install Node.js and npm, which are required to run the application:

```bash
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node -v  # Should display v16.x.x or higher
npm -v   # Should display 8.x.x or higher
```

### 3. Install PostgreSQL

Install PostgreSQL database server:

```bash
sudo apt install -y postgresql postgresql-contrib
```

Start the PostgreSQL service and enable it to start on boot:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Clone the Repository

Install Git and clone the repository:

```bash
sudo apt install -y git
git clone https://github.com/yourusername/student-record-management.git
cd student-record-management
```

### 5. Set Up the Database

Create a new PostgreSQL user and database:

```bash
sudo -u postgres psql -c "CREATE USER studentapp WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE student_records;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE student_records TO studentapp;"
sudo -u postgres psql -c "ALTER USER studentapp WITH SUPERUSER;"
```

### 6. Configure Environment Variables

Create a `.env` file in the project root directory:

```bash
cat > .env << EOF
DATABASE_URL=postgres://studentapp:your_password@localhost:5432/student_records
PORT=5000
EOF
```

### 7. Install Dependencies

Install the required Node.js dependencies:

```bash
npm install
```

### 8. Set Up the Database Schema and Seed Data

Initialize the database schema and add sample data:

```bash
npm run db:push
npm run db:seed
```

### 9. Start the Application

Start the application in development mode:

```bash
npm run dev
```

The application should now be running and accessible at http://localhost:5000

## Production Deployment

For a production environment, follow these additional steps:

### 1. Build the Application

Create an optimized production build:

```bash
npm run build
```

### 2. Set Up Process Manager (PM2)

Install PM2 to keep the application running:

```bash
sudo npm install -g pm2
pm2 start npm --name "student-records" -- start
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $(echo $HOME)
pm2 save
```

### 3. Set Up Nginx as a Reverse Proxy (Optional)

Install and configure Nginx:

```bash
sudo apt install -y nginx
```

Create a configuration file:

```bash
sudo cat > /etc/nginx/sites-available/student-records << EOF
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/student-records /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting Common Issues

### Issue: Node.js version conflict

If you have multiple versions of Node.js installed, you may need to use NVM to manage them:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16
```

### Issue: Database connection errors

If you encounter database connection errors:

1. Check if PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Verify your PostgreSQL credentials:
   ```bash
   psql -U studentapp -d student_records -h localhost
   ```

3. Check your `.env` file for correct DATABASE_URL

### Issue: Application port already in use

If port 5000 is already in use:

1. Find the process using the port:
   ```bash
   sudo lsof -i :5000
   ```

2. Kill the process:
   ```bash
   sudo kill -9 <PID>
   ```

3. Or change the port in `.env` file

## Maintenance

### Database Backup

Regularly back up your database:

```bash
sudo -u postgres pg_dump student_records > backup_$(date +%Y%m%d).sql
```

### Update Application

To update the application:

```bash
cd student-record-management
git pull
npm install
npm run build
pm2 restart student-records
```

### System Logs

Check application logs:

```bash
pm2 logs student-records
```

Check system logs:

```bash
journalctl -u postgresql
journalctl -u nginx
```

For more help, please contact your system administrator or visit our support forum.