// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const roleButtons = document.querySelectorAll('.role-btn');
    const errorMessage = document.getElementById('errorMessage');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const btnText = document.querySelector('.btn-text');
    let selectedRole = 'student';

    // Role selection
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedRole = button.dataset.role;
        });
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        loadingSpinner.style.display = 'block';
        btnText.style.display = 'none';
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: selectedRole,
                    remember_me: rememberMe
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data in localStorage if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify({
                        email,
                        role: selectedRole,
                        token: data.token
                    }));
                } else {
                    sessionStorage.setItem('user', JSON.stringify({
                        email,
                        role: selectedRole,
                        token: data.token
                    }));
                }

                // Redirect based on role
                switch (selectedRole) {
                    case 'student':
                        window.location.href = '/student-dashboard.html';
                        break;
                    case 'faculty':
                        window.location.href = '/faculty-dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = '/admin-dashboard.html';
                        break;
                }
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            // Hide loading state
            loadingSpinner.style.display = 'none';
            btnText.style.display = 'block';
        }
    });

    // Check for stored credentials
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        document.getElementById('email').value = user.email;
        document.getElementById('rememberMe').checked = !!localStorage.getItem('user');
        
        // Set the correct role
        roleButtons.forEach(button => {
            if (button.dataset.role === user.role) {
                button.click();
            }
        });
    }
}); 