// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logout = async () => {
        try {
            // Get the stored user data
            const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                
                // Call logout API
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    // Clear stored data
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    
                    // Redirect to login page
                    window.location.href = '/login.html';
                } else {
                    throw new Error('Logout failed');
                }
            } else {
                // If no stored user data, just redirect to login
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the API call fails, clear local data and redirect
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            window.location.href = '/login.html';
        }
    };

    // Add click event listener to logout button
    const logoutButton = document.querySelector('a[href="logout.html"]');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}); 