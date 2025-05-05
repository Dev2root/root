// File: script.js

$(document).ready(function() {
    // Cache DOM elements
    const $form = $('#registrationForm');
    const $validationResults = $('#validationResults');
    const $resultContent = $('#resultContent');
    
    // Input fields
    const $username = $('#username');
    const $email = $('#email');
    const $password = $('#password');
    const $mobile = $('#mobile');
    
    // Feedback elements
    const $usernameFeedback = $('#usernameFeedback');
    const $emailFeedback = $('#emailFeedback');
    const $passwordFeedback = $('#passwordFeedback');
    const $mobileFeedback = $('#mobileFeedback');

    // Store existing usernames and emails for simulation
    const existingUsernames = ['rahul123', 'priya_patel', 'amit.kumar', 'divya99', 'vikram_sharma'];
    const existingEmails = ['rahul@example.com', 'priya@gmail.com', 'amit@yahoo.com', 'divya@outlook.com', 'vikram@company.in'];

    // Delayed validation check (simulates AJAX call)
    function validateWithDelay(field, value, callback) {
        // Show processing indicator
        field.next('.feedback').html('<span class="processing"><span class="spinner"></span> Validating...</span>');
        
        // Simulate server delay
        setTimeout(function() {
            callback(value);
        }, 800); // 800ms delay to simulate network latency
    }
    
    // Username validation on blur
    $username.on('blur', function() {
        const username = $(this).val().trim();
        
        if (!username) {
            $usernameFeedback.html('<span class="invalid-feedback">Username is required</span>');
            return;
        }
        
        validateWithDelay($username, username, function(value) {
            if (value.length < 5) {
                $usernameFeedback.html('<span class="invalid-feedback">Username must be at least 5 characters</span>');
            } else if (!/^[a-zA-Z0-9._]+$/.test(value)) {
                $usernameFeedback.html('<span class="invalid-feedback">Username can only contain letters, numbers, dots and underscores</span>');
            } else if (existingUsernames.includes(value.toLowerCase())) {
                $usernameFeedback.html('<span class="invalid-feedback">Username already taken</span>');
            } else {
                $usernameFeedback.html('<span class="valid-feedback">Username is available</span>');
            }
        });
    });
    
    // Email validation on blur
    $email.on('blur', function() {
        const email = $(this).val().trim();
        
        if (!email) {
            $emailFeedback.html('<span class="invalid-feedback">Email is required</span>');
            return;
        }
        
        validateWithDelay($email, email, function(value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                $emailFeedback.html('<span class="invalid-feedback">Please enter a valid email address</span>');
            } else if (existingEmails.includes(value.toLowerCase())) {
                $emailFeedback.html('<span class="invalid-feedback">Email already registered</span>');
            } else {
                $emailFeedback.html('<span class="valid-feedback">Email is valid</span>');
            }
        });
    });
    
    // Password validation on input
    $password.on('input', function() {
        const password = $(this).val();
        
        if (!password) {
            $passwordFeedback.html('<span class="invalid-feedback">Password is required</span>');
            return;
        }
        
        let strength = 0;
        let message = '';
        
        // At least 8 characters
        if (password.length >= 8) strength++;
        // Contains lowercase letters
        if (/[a-z]/.test(password)) strength++;
        // Contains uppercase letters
        if (/[A-Z]/.test(password)) strength++;
        // Contains numbers
        if (/[0-9]/.test(password)) strength++;
        // Contains special characters
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        switch (strength) {
            case 0:
            case 1:
                message = '<span class="invalid-feedback">Very weak password</span>';
                break;
            case 2:
                message = '<span class="invalid-feedback">Weak password</span>';
                break;
            case 3:
                message = '<span class="valid-feedback">Medium strength password</span>';
                break;
            case 4:
                message = '<span class="valid-feedback">Strong password</span>';
                break;
            case 5:
                message = '<span class="valid-feedback">Very strong password</span>';
                break;
        }
        
        $passwordFeedback.html(message);
    });
    
    // Mobile validation on blur
    $mobile.on('blur', function() {
        const mobile = $(this).val().trim();
        
        if (!mobile) {
            $mobileFeedback.html('<span class="invalid-feedback">Mobile number is required</span>');
            return;
        }
        
        validateWithDelay($mobile, mobile, function(value) {
            // Indian mobile number validation (10 digits starting with 6-9)
            if (!/^[6-9]\d{9}$/.test(value)) {
                $mobileFeedback.html('<span class="invalid-feedback">Please enter a valid 10-digit Indian mobile number</span>');
            } else {
                $mobileFeedback.html('<span class="valid-feedback">Mobile number is valid</span>');
            }
        });
    });
    
    // Form submission with AJAX
    $form.on('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            username: $username.val().trim(),
            email: $email.val().trim(),
            password: $password.val(),
            mobile: $mobile.val().trim()
        };
        
        // Clear previous results
        $resultContent.empty();
        
        // Show processing in the results area
        $validationResults.removeClass('d-none');
        $resultContent.html('<div class="text-center"><span class="spinner"></span> Processing registration...</div>');
        
        // Simulate AJAX request to server
        setTimeout(function() {
            const validationResults = [];
            let hasErrors = false;
            
            // Validate username
            if (!formData.username) {
                validationResults.push({
                    field: 'username',
                    status: 'error',
                    message: 'Username is required'
                });
                hasErrors = true;
            } else if (formData.username.length < 5) {
                validationResults.push({
                    field: 'username',
                    status: 'error',
                    message: 'Username must be at least 5 characters'
                });
                hasErrors = true;
            } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
                validationResults.push({
                    field: 'username',
                    status: 'error',
                    message: 'Username can only contain letters, numbers, dots and underscores'
                });
                hasErrors = true;
            } else if (existingUsernames.includes(formData.username.toLowerCase())) {
                validationResults.push({
                    field: 'username',
                    status: 'error',
                    message: 'Username already taken'
                });
                hasErrors = true;
            } else {
                validationResults.push({
                    field: 'username',
                    status: 'success',
                    message: 'Username is valid'
                });
            }
            
            // Validate email
            if (!formData.email) {
                validationResults.push({
                    field: 'email',
                    status: 'error',
                    message: 'Email is required'
                });
                hasErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                validationResults.push({
                    field: 'email',
                    status: 'error',
                    message: 'Please enter a valid email address'
                });
                hasErrors = true;
            } else if (existingEmails.includes(formData.email.toLowerCase())) {
                validationResults.push({
                    field: 'email',
                    status: 'error',
                    message: 'Email already registered'
                });
                hasErrors = true;
            } else {
                validationResults.push({
                    field: 'email',
                    status: 'success',
                    message: 'Email is valid'
                });
            }
            
            // Validate password
            if (!formData.password) {
                validationResults.push({
                    field: 'password',
                    status: 'error',
                    message: 'Password is required'
                });
                hasErrors = true;
            } else {
                let strength = 0;
                
                // At least 8 characters
                if (formData.password.length >= 8) strength++;
                // Contains lowercase letters
                if (/[a-z]/.test(formData.password)) strength++;
                // Contains uppercase letters
                if (/[A-Z]/.test(formData.password)) strength++;
                // Contains numbers
                if (/[0-9]/.test(formData.password)) strength++;
                // Contains special characters
                if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
                
                if (strength < 3) {
                    validationResults.push({
                        field: 'password',
                        status: 'warning',
                        message: 'Password is weak. Consider using a stronger password.'
                    });
                } else {
                    validationResults.push({
                        field: 'password',
                        status: 'success',
                        message: 'Password is strong'
                    });
                }
            }
            
            // Validate mobile
            if (!formData.mobile) {
                validationResults.push({
                    field: 'mobile',
                    status: 'error',
                    message: 'Mobile number is required'
                });
                hasErrors = true;
            } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
                validationResults.push({
                    field: 'mobile',
                    status: 'error',
                    message: 'Please enter a valid 10-digit Indian mobile number'
                });
                hasErrors = true;
            } else {
                validationResults.push({
                    field: 'mobile',
                    status: 'success',
                    message: 'Mobile number is valid'
                });
            }
            
            // Clear result content
            $resultContent.empty();
            
            // Add overall status message
            if (hasErrors) {
                $resultContent.append('<div class="alert alert-danger mb-3">Registration failed! Please fix the errors.</div>');
            } else {
                $resultContent.append('<div class="alert alert-success mb-3">Registration successful! All fields are valid.</div>');
            }
            
            // Add each validation result
            const resultHTML = $('<div class="validation-details"></div>');
            
            validationResults.forEach(function(result) {
                const statusClass = result.status === 'success' ? 'result-success' : 
                                   (result.status === 'warning' ? 'result-warning' : 'result-error');
                
                const icon = result.status === 'success' ? '✓' : 
                            (result.status === 'warning' ? '⚠' : '✗');
                
                resultHTML.append(`
                    <div class="result-item ${statusClass}">
                        <strong>${icon} ${result.field.charAt(0).toUpperCase() + result.field.slice(1)}:</strong> ${result.message}
                    </div>
                `);
            });
            
            // Append results to the container
            $resultContent.append(resultHTML);
            
        }, 1500); // Simulating server processing time
    });
});

/* 
HOW TO RUN:
1. Save this file as script.js in your project directory
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