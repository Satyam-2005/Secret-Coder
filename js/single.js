// Single course page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    // Get the course container
    const courseContainer = document.getElementById('courseContainer');
    
    // Get the enroll button
    const enrollButton = document.getElementById('enrollButton');
    
    // Function to load course
    async function loadCourse() {
        try {
            // Show loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'block';
            
            // Get course data
            const response = await window.api.courses.getCourse(courseId);
            const course = response.data;
            
            // Update course container
            courseContainer.innerHTML = `
                <div class="container-xxl py-5">
                    <div class="container">
                        <div class="row g-5">
                            <div class="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="wow fadeInUp" data-wow-delay="0.3s">
                                    <img class="img-fluid" src="${course.image || 'img/course-1.jpg'}" alt="${course.title}">
                                </div>
                                <div class="wow fadeInUp" data-wow-delay="0.5s">
                                    <h1 class="mb-4">${course.title}</h1>
                                    <p>${course.description}</p>
                                </div>
                                <div class="wow fadeInUp" data-wow-delay="0.7s">
                                    <h2 class="mb-4">Course Content</h2>
                                    <div class="accordion" id="accordionExample">
                                        ${course.content?.map((section, index) => `
                                            <div class="accordion-item">
                                                <h2 class="accordion-header" id="heading${index}">
                                                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                                                        ${section.title}
                                                    </button>
                                                </h2>
                                                <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                        ${section.description}
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('') || '<p>No content available.</p>'}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="bg-light rounded p-5">
                                    <h3 class="mb-4">Course Details</h3>
                                    <p><i class="fa fa-user-tie text-primary me-2"></i>Instructor: ${course.instructor?.name || 'Unknown Instructor'}</p>
                                    <p><i class="fa fa-clock text-primary me-2"></i>Duration: ${course.duration || 'N/A'}</p>
                                    <p><i class="fa fa-user text-primary me-2"></i>Students: ${course.students?.length || 0}</p>
                                    <p><i class="fa fa-star text-primary me-2"></i>Rating: ${course.rating || 0}/5</p>
                                    <p><i class="fa fa-tag text-primary me-2"></i>Category: ${course.category?.name || 'Uncategorized'}</p>
                                    <p><i class="fa fa-calendar text-primary me-2"></i>Last Updated: ${new Date(course.updatedAt).toLocaleDateString()}</p>
                                    <button id="enrollButton" class="btn btn-primary w-100 py-3">Enroll Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listener to enroll button
            const newEnrollButton = document.getElementById('enrollButton');
            if (newEnrollButton) {
                newEnrollButton.addEventListener('click', enrollInCourse);
            }
            
            // Initialize WOW.js
            new WOW().init();
        } catch (error) {
            console.error('Error loading course:', error);
            courseContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading course. Please try again later.</p></div>';
        } finally {
            // Hide loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'none';
        }
    }
    
    // Function to enroll in course
    async function enrollInCourse() {
        try {
            // Check if user is logged in
            if (!window.api.isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            
            // Show loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'block';
            
            // Enroll in course
            await window.api.courses.enrollInCourse(courseId);
            
            // Show success message
            alert('Successfully enrolled in the course!');
            
            // Reload page
            window.location.reload();
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert(error.message || 'Error enrolling in course. Please try again later.');
        } finally {
            // Hide loading spinner
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'none';
        }
    }
    
    // Load course if ID is provided
    if (courseId) {
        loadCourse();
    } else {
        courseContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">No course ID provided.</p></div>';
    }
}); 