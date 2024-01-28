function validateForm() {
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value.trim();
    var errorMessages = '';
    // Validate Email
    if (email === '') {
        errorMessages += 'Email is required<br>';
    } else if (!isValidEmail(email)) {
        errorMessages += 'Invalid email format<br>';
    }

    // Validate Password
    if (password === '') {
        errorMessages += 'Password is required<br>';
    }

    // Display error messages
    document.getElementById('errorMessages').innerHTML = errorMessages;

    // Return false to prevent form submission if there are errors
    return errorMessages === '';
}

// Function to validate email format
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
