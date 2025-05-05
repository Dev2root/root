# Flask BMI Calculator - Installation and Run Instructions for Ubuntu

Follow these step-by-step instructions to set up and run the BMI calculator on Ubuntu:

## Step 1: Install Python and pip
If you don't have Python installed already, run the following commands:

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

## Step 2: Create a project directory
```bash
mkdir flask_bmi_calculator
cd flask_bmi_calculator
```

## Step 3: Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

## Step 4: Create the application files
Create two files in your project directory:

1. Create `app.py` with the provided code
2. Create `requirements.txt` with the provided dependencies

## Step 5: Install the required dependencies
```bash
pip install -r requirements.txt
```

## Step 6: Run the application
```bash
python app.py
```

The application will create the necessary `templates` directory and HTML file automatically on first run.

## Step 7: Access the BMI Calculator
Open a web browser and navigate to:
```
http://127.0.0.1:5000
```
or if accessing from another device on the same network:
```
http://<your-server-ip>:5000
```

## Notes
- The application runs in debug mode, which is convenient for development but should be disabled in production
- The application binds to all network interfaces (0.0.0.0) so it's accessible from other devices on the network
- To stop the application, press Ctrl+C in the terminal where it's running
