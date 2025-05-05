// File: app.js
// Student Registration Application

// Initialize Angular module
angular.module('studentApp', [])
    .controller('StudentController', function($scope) {
        // Initialize student object
        $scope.student = {
            name: '',
            email: '',
            mobile: '',
            course: '',
            gender: ''
        };

        // Initialize registered students array with sample Indian names
        $scope.registeredStudents = [
            {
                name: 'Rahul Sharma',
                email: 'rahul.sharma@example.com',
                mobile: '9876543210',
                course: 'B.Tech',
                gender: 'Male'
            },
            {
                name: 'Priya Patel',
                email: 'priya.patel@example.com',
                mobile: '8765432109',
                course: 'MCA',
                gender: 'Female'
            }
        ];

        // Initially hide the preview section
        $scope.showPreview = false;

        // Form submission function
        $scope.submitForm = function() {
            // Show the preview section
            $scope.showPreview = true;
            
            // Add student to registered students array
            $scope.registeredStudents.push(angular.copy($scope.student));
            
            // Optional: Log the registered student for debugging
            console.log('Student registered:', $scope.student);
        };
    });

/* 
HOW TO RUN:
1. Save this file as app.js in your project directory
2. Make sure you have index.html and styles.css in the same directory
3. Open index.html in a web browser

For Ubuntu system:
- If you have Python installed:
  - Open terminal in the project directory
  - Run: python3 -m http.server 8000
  - Open a browser and go to: http://localhost:8000

- If you have Node.js installed:
  - Install http-server: npm install -g http-server
  - Run: http-server
  - Open a browser and go to: http://localhost:8080
*/
