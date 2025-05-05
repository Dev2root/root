# Task Manager Application

A simple task management application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- Create, read, update, and delete tasks
- Filter tasks by status (All, Pending, In Progress, Completed)
- Clean and responsive UI with smooth animations
- Real-time feedback for user actions

## Prerequisites

Before running this application, make sure you have the following installed on your Ubuntu machine:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)

## Installation Steps

### 1. Install MongoDB on Ubuntu

```bash
# Import the public key used by the package management system
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Reload local package database
sudo apt-get update

# Install MongoDB packages
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod