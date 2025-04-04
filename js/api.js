// API Service for connecting frontend with backend

const API_URL = 'http://localhost:5000/api';

// Authentication API calls
const authAPI = {
    // Register a new user
    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Login user
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Get current user
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No token found');
            }
            
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get user data');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
};

// Courses API calls
const coursesAPI = {
    // Get all courses
    getAllCourses: async () => {
        try {
            const response = await fetch(`${API_URL}/courses`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch courses');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Get single course
    getCourse: async (courseId) => {
        try {
            const response = await fetch(`${API_URL}/courses/${courseId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch course');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Create course (requires authentication)
    createCourse: async (courseData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Authentication required');
            }
            
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create course');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Enroll in a course
    enrollInCourse: async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Authentication required');
            }
            
            const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to enroll in course');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }
};

// Categories API calls
const categoriesAPI = {
    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch categories');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }
};

// Instructors API calls
const instructorsAPI = {
    // Get all instructors
    getAllInstructors: async () => {
        try {
            const response = await fetch(`${API_URL}/instructors`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch instructors');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    // Get single instructor
    getInstructor: async (instructorId) => {
        try {
            const response = await fetch(`${API_URL}/instructors/${instructorId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch instructor');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Helper function to get current user from localStorage
const getCurrentUserFromStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Export all API functions
window.api = {
    auth: authAPI,
    courses: coursesAPI,
    categories: categoriesAPI,
    instructors: instructorsAPI,
    isAuthenticated,
    getCurrentUserFromStorage
}; 