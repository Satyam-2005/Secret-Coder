// Courses page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get the courses container
    const coursesContainer = document.getElementById('coursesContainer');
    
    // Get the categories container
    const categoriesContainer = document.getElementById('categoriesContainer');
    
    // Get the search input
    const searchInput = document.getElementById('searchInput');
    
    // Get the category filter
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Function to load courses
    async function loadCourses() {
        try {
            // Show loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'block';
            
            // Get all courses
            const response = await window.api.courses.getAllCourses();
            const courses = response.data;
            
            // Clear courses container
            coursesContainer.innerHTML = '';
            
            // Add courses to container
            courses.forEach(course => {
                const courseElement = createCourseElement(course);
                coursesContainer.appendChild(courseElement);
            });
            
            // Initialize WOW.js
            new WOW().init();
        } catch (error) {
            console.error('Error loading courses:', error);
            coursesContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Please try again later.</p></div>';
        } finally {
            // Hide loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'none';
        }
    }
    
    // Function to load categories
    async function loadCategories() {
        try {
            // Get all categories
            const response = await window.api.categories.getAllCategories();
            const categories = response.data;
            
            // Clear categories container
            categoriesContainer.innerHTML = '';
            
            // Add categories to container
            categories.forEach(category => {
                const categoryElement = createCategoryElement(category);
                categoriesContainer.appendChild(categoryElement);
            });
            
            // Add categories to filter dropdown
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category._id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            categoriesContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading categories. Please try again later.</p></div>';
        }
    }
    
    // Function to create course element
    function createCourseElement(course) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 wow fadeInUp';
        col.setAttribute('data-wow-delay', '0.1s');
        
        col.innerHTML = `
            <div class="course-item bg-light">
                <div class="position-relative overflow-hidden">
                    <img class="img-fluid" src="${course.image || 'img/course-1.jpg'}" alt="${course.title}">
                </div>
                <div class="text-center p-4 pb-0">
                    <div class="mb-3">
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small class="fa fa-star text-primary"></small>
                        <small>(${course.rating || 0})</small>
                    </div>
                    <h5 class="mb-4">${course.title}</h5>
                </div>
                <div class="d-flex border-top">
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-user-tie text-primary me-2"></i>${course.instructor?.name || 'Unknown Instructor'}</small>
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-clock text-primary me-2"></i>${course.duration || 'N/A'}</small>
                    <small class="flex-fill text-center py-2"><i class="fa fa-user text-primary me-2"></i>${course.students?.length || 0} Students</small>
                </div>
                <div class="text-center p-4">
                    <a class="btn btn-primary" href="single.html?id=${course._id}">Read More</a>
                </div>
            </div>
        `;
        
        return col;
    }
    
    // Function to create category element
    function createCategoryElement(category) {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 wow fadeInUp';
        col.setAttribute('data-wow-delay', '0.1s');
        
        col.innerHTML = `
            <a class="cat-item rounded p-4" href="courses.html?category=${category._id}">
                <i class="fa fa-3x fa-code text-primary mb-4"></i>
                <h6 class="mb-3">${category.name}</h6>
                <p class="mb-0">${category.courses?.length || 0} Courses</p>
            </a>
        `;
        
        return col;
    }
    
    // Function to filter courses
    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryId = categoryFilter.value;
        
        const courseElements = coursesContainer.querySelectorAll('.col-lg-4');
        
        courseElements.forEach(element => {
            const title = element.querySelector('h5').textContent.toLowerCase();
            const category = element.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = !categoryId || category === categoryId;
            
            element.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }
    
    // Add event listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    // Load initial data
    loadCategories();
    loadCourses();
}); 