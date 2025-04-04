// Signup page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (window.api.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }
    
    // Get the signup form
    const signupForm = document.getElementById('signupForm');
    
    // Add submit event listener to the form
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        const spinner = document.getElementById('spinner');
        spinner.style.display = 'block';
        
        try {
            // Get form data
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate form data
            if (!username || !email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            
            // Call register API
            await window.api.auth.register({ username, email, password });
            
            // Redirect to home page on success
            window.location.href = '/index.html';
        } catch (error) {
            // Show error message
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            // Hide loading spinner
            spinner.style.display = 'none';
        }
    });
}); 