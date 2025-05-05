// File: app.js
// Student Registration Application with Events and Validations

// Initialize Angular module
angular.module('studentApp', [])
    .controller('StudentController', function($scope, $window) {
        // Initialize student object
        $scope.initializeStudent = function() {
            return {
                name: '',
                email: '',
                mobile: '',
                course: '',
                gender: '',
                dateOfBirth: null,
                address: ''
            };
        };

        // Set today's date for date validation
        $scope.maxDate = new Date();

        // Set current date for registration timestamp
        $scope.registrationDate = new Date();

        // Initialize student and validation status
        $scope.student = $scope.initializeStudent();
        $scope.submitted = false;
        $scope.showPreview = false;
        $scope.showModal = false;
        $scope.deleteIndex = -1;
        $scope.courseFee = 0;

        // Course fee mapping
        $scope.courseFees = {
            'B.Tech': 120000,
            'M.Tech': 150000,
            'BCA': 80000,
            'MCA': 100000
        };

        // Initialize registered students array with sample Indian names
        $scope.registeredStudents = [
            {
                name: 'Rahul Sharma',
                email: 'rahul.sharma@example.com',
                mobile: '9876543210',
                course: 'B.Tech',
                gender: 'Male',
                dateOfBirth: new Date('1998-05-15'),
                address: '123 Nehru Street, New Delhi, Delhi 110001',
                registrationDate: new Date('2025-04-01')
            },
            {
                name: 'Priya Patel',
                email: 'priya.patel@example.com',
                mobile: '8765432109',
                course: 'MCA',
                gender: 'Female',
                dateOfBirth: new Date('1999-10-22'),
                address: '456 Gandhi Road, Mumbai, Maharashtra 400001',
                registrationDate: new Date('2025-04-10')
            },
            {
                name: 'Ankit Singh',
                email: 'ankit.singh@example.com',
                mobile: '9567812340',
                course: 'BCA',
                gender: 'Male',
                dateOfBirth: new Date('2000-03-12'),
                address: '789 Subhash Marg, Bangalore, Karnataka 560001',
                registrationDate: new Date('2025-04-15')
            }
        ];

        // Update course fee when course is selected
        $scope.updateFees = function() {
            if ($scope.student.course) {
                $scope.courseFee = $scope.courseFees[$scope.student.course];
            } else {
                $scope.courseFee = 0;
            }
        };

        // Calculate age from date of birth
        $scope.calculateAge = function(dateOfBirth) {
            if (!dateOfBirth) return '';
            
            var dob = new Date(dateOfBirth);
            var today = new Date();
            var age = today.getFullYear() - dob.getFullYear();
            
            // Adjust age if birthday hasn't occurred yet this year
            if (today.getMonth() < dob.getMonth() || 
                (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
                age--;
            }
            
            return age;
        };

        // Form submission function with validation
        $scope.submitForm = function(isValid) {
            $scope.submitted = true;
            
            // Validate form
            if (!isValid) {
                $window.alert('Please fix the validation errors before submitting.');
                return;
            }
            
            // Show the preview section
            $scope.showPreview = true;
            $scope.registrationDate = new Date();
            
            // Add student to registered students array
            $scope.registeredStudents.push({
                name: $scope.student.name,
                email: $scope.student.email,
                mobile: $scope.student.mobile,
                course: $scope.student.course,
                gender: $scope.student.gender,
                dateOfBirth: $scope.student.dateOfBirth,
                address: $scope.student.address,
                registrationDate: $scope.registrationDate
            });
            
            // Log the registered student for debugging
            console.log('Student registered:', $scope.student);
        };

        // Reset form function
        $scope.resetForm = function() {
            $scope.student = $scope.initializeStudent();
            $scope.submitted = false;
            $scope.showPreview = false;
            $scope.courseFee = 0;
            
            if ($scope.studentForm) {
                $scope.studentForm.$setPristine();
                $scope.studentForm.$setUntouched();
            }
        };

        // Edit button function
        $scope.editStudent = function() {
            $scope.showPreview = false;
            $window.scrollTo(0, 0);
        };

        // Select a student from the table
        $scope.selectStudent = function(index) {
            // Clear any previous selections
            $scope.registeredStudents.forEach(function(s) {
                s.selected = false;
            });
            
            // Set the selected property for the clicked student
            $scope.registeredStudents[index].selected = true;
        };

        // Delete a student
        $scope.deleteStudent = function(index, event) {
            // Stop the click event from propagating to parent elements
            if (event) {
                event.stopPropagation();
            }
            
            $scope.deleteIndex = index;
            $scope.showModal = true;

            // In a real application, we'd use a proper modal library
            // For this demo, we're using a simple flag to show/hide modal
            $('#confirmationModal').modal('show');
        };

        // Close the confirmation modal
        $scope.closeModal = function() {
            $scope.showModal = false;
            $scope.deleteIndex = -1;
            
            // In a real application, we'd use a proper modal library
            $('#confirmationModal').modal('hide');
        };

        // Confirm delete action
        $scope.confirmDelete = function() {
            if ($scope.deleteIndex > -1) {
                $scope.registeredStudents.splice($scope.deleteIndex, 1);
                $scope.deleteIndex = -1;
                $scope.showModal = false;
                
                // In a real application, we'd use a proper modal library
                $('#confirmationModal').modal('hide');
            }
        };
    });

// Add Bootstrap Modal support (simulation)
$(document).ready(function() {
    // Simulate Bootstrap modal behavior
    $.fn.modal = function(action) {
        if (action === 'show') {
            this.addClass('show');
            this.css('display', 'block');
            $('body').addClass('modal-open');
            $('<div class="modal-backdrop fade show"></div>').appendTo('body');
        } else if (action === 'hide') {
            this.removeClass('show');
            this.css('display', 'none');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
        return this;
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