// Student Dashboard JavaScript

// Student Profile Management
class StudentProfile {
    constructor() {
        this.profile = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Edit profile form submission
        document.getElementById('editProfileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
    }

    async loadProfile() {
        try {
            const response = await fetch('/api/student/profile');
            if (response.ok) {
                this.profile = await response.json();
                this.displayProfile();
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    displayProfile() {
        if (!this.profile) return;

        // Update profile information in the UI
        document.getElementById('studentName').textContent = this.profile.name;
        document.getElementById('studentId').textContent = `ID: ${this.profile.id}`;
        document.getElementById('studentEmail').textContent = this.profile.email;
        document.getElementById('studentDepartment').textContent = this.profile.department;
        document.getElementById('studentSemester').textContent = this.profile.semester;
        document.getElementById('studentEnrollmentYear').textContent = this.profile.enrollment_year;
        document.getElementById('studentGPA').textContent = this.profile.gpa || 'N/A';

        // Populate edit form
        document.getElementById('editName').value = this.profile.name;
        document.getElementById('editEmail').value = this.profile.email;
        document.getElementById('editDepartment').value = this.profile.department;
        document.getElementById('editSemester').value = this.profile.semester;
        document.getElementById('editEnrollmentYear').value = this.profile.enrollment_year;
    }

    async updateProfile() {
        const formData = {
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            department: document.getElementById('editDepartment').value,
            semester: document.getElementById('editSemester').value,
            enrollment_year: document.getElementById('editEnrollmentYear').value
        };

        try {
            const response = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.profile = await response.json();
                this.displayProfile();
                $('#editProfileModal').modal('hide');
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    }
}

// Course Enrollment Management
class CourseEnrollment {
    constructor() {
        this.enrolledCourses = [];
        this.availableCourses = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Course search input
        document.getElementById('courseSearchInput').addEventListener('input', (e) => {
            this.filterAvailableCourses(e.target.value);
        });
    }

    async loadEnrolledCourses() {
        try {
            const response = await fetch('/api/student/enrolled-courses');
            if (response.ok) {
                this.enrolledCourses = await response.json();
                this.updateEnrolledCoursesTable();
                this.updateCourseSelects();
            }
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
        }
    }

    async loadAvailableCourses() {
        try {
            const response = await fetch('/api/courses');
            if (response.ok) {
                this.availableCourses = await response.json();
                this.updateAvailableCoursesTable();
            }
        } catch (error) {
            console.error('Error loading available courses:', error);
        }
    }

    updateEnrolledCoursesTable() {
        const tableBody = document.getElementById('enrolledCoursesTableBody');
        tableBody.innerHTML = '';

        this.enrolledCourses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.faculty}</td>
                <td>${course.schedule}</td>
                <td>${this.formatStatus(course.status)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="courseEnrollment.viewCourse(${course.id})">
                        <i class="fa fa-eye"></i> View
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    updateAvailableCoursesTable() {
        const tableBody = document.getElementById('availableCoursesTableBody');
        tableBody.innerHTML = '';

        this.availableCourses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.faculty}</td>
                <td>${course.description}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="courseEnrollment.enrollInCourse(${course.id})">
                        <i class="fa fa-plus"></i> Enroll
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    filterAvailableCourses(searchTerm) {
        const tableBody = document.getElementById('availableCoursesTableBody');
        tableBody.innerHTML = '';

        const filteredCourses = this.availableCourses.filter(course => 
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredCourses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.faculty}</td>
                <td>${course.description}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="courseEnrollment.enrollInCourse(${course.id})">
                        <i class="fa fa-plus"></i> Enroll
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    updateCourseSelects() {
        const courseSelects = [
            document.getElementById('lectureCourseSelect'),
            document.getElementById('quizCourseSelect'),
            document.getElementById('gradesCourseSelect')
        ];

        courseSelects.forEach(select => {
            if (select) {
                // Clear existing options except the first one
                while (select.options.length > 1) {
                    select.remove(1);
                }

                // Add enrolled courses
                this.enrolledCourses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = course.name;
                    select.appendChild(option);
                });
            }
        });
    }

    async enrollInCourse(courseId) {
        try {
            const response = await fetch('/api/student/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course_id: courseId })
            });

            if (response.ok) {
                alert('Successfully enrolled in the course!');
                this.loadEnrolledCourses();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to enroll in the course. Please try again.');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll in the course. Please try again.');
        }
    }

    viewCourse(courseId) {
        // Implement course view functionality
        console.log('Viewing course:', courseId);
    }

    formatStatus(status) {
        const statusClasses = {
            'active': 'badge bg-success',
            'completed': 'badge bg-primary',
            'pending': 'badge bg-warning'
        };

        const statusText = {
            'active': 'Active',
            'completed': 'Completed',
            'pending': 'Pending'
        };

        return `<span class="${statusClasses[status] || 'badge bg-secondary'}">${statusText[status] || status}</span>`;
    }
}

// Lecture Access Management
class LectureAccess {
    constructor() {
        this.lectures = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Course selection change
        document.getElementById('lectureCourseSelect').addEventListener('change', () => {
            this.loadLectures();
        });

        // Lecture type selection change
        document.getElementById('lectureTypeSelect').addEventListener('change', () => {
            this.loadLectures();
        });
    }

    async loadLectures() {
        const courseId = document.getElementById('lectureCourseSelect').value;
        const lectureType = document.getElementById('lectureTypeSelect').value;

        if (!courseId || !lectureType) {
            document.getElementById('lectureContent').innerHTML = `
                <div class="alert alert-info">
                    Please select a course and lecture type to view content.
                </div>
            `;
            return;
        }

        try {
            const response = await fetch(`/api/student/lectures?course_id=${courseId}&type=${lectureType}`);
            if (response.ok) {
                this.lectures = await response.json();
                this.displayLectures();
            }
        } catch (error) {
            console.error('Error loading lectures:', error);
        }
    }

    displayLectures() {
        const lectureContent = document.getElementById('lectureContent');
        
        if (this.lectures.length === 0) {
            lectureContent.innerHTML = `
                <div class="alert alert-info">
                    No lectures available for the selected course and type.
                </div>
            `;
            return;
        }

        let content = '';
        
        if (this.lectures[0].type === 'recorded') {
            content = this.displayRecordedLectures();
        } else if (this.lectures[0].type === 'live') {
            content = this.displayLiveClasses();
        } else if (this.lectures[0].type === 'materials') {
            content = this.displayCourseMaterials();
        }

        lectureContent.innerHTML = content;
    }

    displayRecordedLectures() {
        let html = '<div class="row">';
        
        this.lectures.forEach(lecture => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${lecture.title}</h5>
                            <p class="card-text">${lecture.description}</p>
                            <p class="card-text"><small class="text-muted">Duration: ${lecture.duration}</small></p>
                            <button class="btn btn-primary" onclick="lectureAccess.playLecture(${lecture.id})">
                                <i class="fa fa-play"></i> Play
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    displayLiveClasses() {
        let html = '<div class="row">';
        
        this.lectures.forEach(lecture => {
            const isUpcoming = new Date(lecture.schedule) > new Date();
            const buttonClass = isUpcoming ? 'btn-success' : 'btn-secondary';
            const buttonText = isUpcoming ? 'Join' : 'Recorded';
            const buttonIcon = isUpcoming ? 'fa-video' : 'fa-play';
            
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${lecture.title}</h5>
                            <p class="card-text">${lecture.description}</p>
                            <p class="card-text"><small class="text-muted">Schedule: ${new Date(lecture.schedule).toLocaleString()}</small></p>
                            <button class="btn ${buttonClass}" onclick="lectureAccess.${isUpcoming ? 'joinLiveClass' : 'playLecture'}(${lecture.id})">
                                <i class="fa ${buttonIcon}"></i> ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    displayCourseMaterials() {
        let html = '<div class="list-group">';
        
        this.lectures.forEach(material => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${material.title}</h5>
                        <small>${material.type}</small>
                    </div>
                    <p class="mb-1">${material.description}</p>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary" onclick="lectureAccess.downloadMaterial(${material.id})">
                            <i class="fa fa-download"></i> Download
                        </button>
                        <button class="btn btn-sm btn-info" onclick="lectureAccess.viewMaterial(${material.id})">
                            <i class="fa fa-eye"></i> View
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    playLecture(lectureId) {
        // Implement lecture playback functionality
        console.log('Playing lecture:', lectureId);
    }

    joinLiveClass(lectureId) {
        // Implement live class joining functionality
        console.log('Joining live class:', lectureId);
    }

    downloadMaterial(materialId) {
        // Implement material download functionality
        console.log('Downloading material:', materialId);
    }

    viewMaterial(materialId) {
        // Implement material viewing functionality
        console.log('Viewing material:', materialId);
    }
}

// Assignment Submission Management
class AssignmentSubmission {
    constructor() {
        this.assignments = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Assignment submission form
        document.getElementById('submitAssignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAssignment();
        });
    }

    async loadAssignments() {
        try {
            const response = await fetch('/api/student/assignments');
            if (response.ok) {
                this.assignments = await response.json();
                this.updateAssignmentsTable();
                this.updatePendingAssignmentsAlert();
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    }

    updateAssignmentsTable() {
        const tableBody = document.getElementById('assignmentsTableBody');
        tableBody.innerHTML = '';

        this.assignments.forEach(assignment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${assignment.name}</td>
                <td>${assignment.course}</td>
                <td>${new Date(assignment.due_date).toLocaleString()}</td>
                <td>${this.formatStatus(assignment.status)}</td>
                <td>
                    ${this.getAssignmentActionButton(assignment)}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    updatePendingAssignmentsAlert() {
        const pendingAssignments = this.assignments.filter(assignment => 
            assignment.status === 'pending' && new Date(assignment.due_date) > new Date()
        );

        const alertElement = document.getElementById('pendingAssignmentsAlert');
        const countElement = document.getElementById('pendingAssignmentsCount');

        if (pendingAssignments.length > 0) {
            countElement.textContent = pendingAssignments.length;
            alertElement.style.display = 'block';
        } else {
            alertElement.style.display = 'none';
        }
    }

    getAssignmentActionButton(assignment) {
        if (assignment.status === 'pending') {
            return `
                <button class="btn btn-sm btn-primary" onclick="assignmentSubmission.openSubmissionModal(${assignment.id})">
                    <i class="fa fa-upload"></i> Submit
                </button>
            `;
        } else if (assignment.status === 'submitted') {
            return `
                <button class="btn btn-sm btn-info" onclick="assignmentSubmission.viewSubmission(${assignment.id})">
                    <i class="fa fa-eye"></i> View
                </button>
            `;
        } else if (assignment.status === 'graded') {
            return `
                <button class="btn btn-sm btn-success" onclick="assignmentSubmission.viewGrade(${assignment.id})">
                    <i class="fa fa-star"></i> View Grade
                </button>
            `;
        } else {
            return `
                <button class="btn btn-sm btn-secondary" disabled>
                    <i class="fa fa-clock"></i> Expired
                </button>
            `;
        }
    }

    openSubmissionModal(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        document.getElementById('assignmentName').value = assignment.name;
        document.getElementById('assignmentCourse').value = assignment.course;
        document.getElementById('assignmentDueDate').value = new Date(assignment.due_date).toLocaleString();

        $('#submitAssignmentModal').modal('show');
    }

    async submitAssignment() {
        const formData = new FormData();
        formData.append('file', document.getElementById('assignmentFile').files[0]);
        formData.append('comments', document.getElementById('assignmentComments').value);
        formData.append('assignment_id', document.getElementById('assignmentName').value);

        try {
            const response = await fetch('/api/student/submit-assignment', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Assignment submitted successfully!');
                $('#submitAssignmentModal').modal('hide');
                this.loadAssignments();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to submit assignment. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Failed to submit assignment. Please try again.');
        }
    }

    viewSubmission(assignmentId) {
        // Implement submission viewing functionality
        console.log('Viewing submission:', assignmentId);
    }

    viewGrade(assignmentId) {
        // Implement grade viewing functionality
        console.log('Viewing grade:', assignmentId);
    }

    formatStatus(status) {
        const statusClasses = {
            'pending': 'badge bg-warning',
            'submitted': 'badge bg-info',
            'graded': 'badge bg-success',
            'expired': 'badge bg-danger'
        };

        const statusText = {
            'pending': 'Pending',
            'submitted': 'Submitted',
            'graded': 'Graded',
            'expired': 'Expired'
        };

        return `<span class="${statusClasses[status] || 'badge bg-secondary'}">${statusText[status] || status}</span>`;
    }
}

// Quiz & Exam Management
class QuizExam {
    constructor() {
        this.quizzes = [];
        this.currentQuiz = null;
        this.quizTimer = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Course selection change
        document.getElementById('quizCourseSelect').addEventListener('change', () => {
            this.loadQuizzes();
        });

        // Quiz type selection change
        document.getElementById('quizTypeSelect').addEventListener('change', () => {
            this.loadQuizzes();
        });

        // Quiz submission
        document.getElementById('submitQuizBtn').addEventListener('click', () => {
            this.submitQuiz();
        });
    }

    async loadQuizzes() {
        const courseId = document.getElementById('quizCourseSelect').value;
        const quizType = document.getElementById('quizTypeSelect').value;

        if (!courseId || !quizType) {
            document.getElementById('quizzesTableBody').innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/api/student/quizzes?course_id=${courseId}&type=${quizType}`);
            if (response.ok) {
                this.quizzes = await response.json();
                this.updateQuizzesTable();
            }
        } catch (error) {
            console.error('Error loading quizzes:', error);
        }
    }

    updateQuizzesTable() {
        const tableBody = document.getElementById('quizzesTableBody');
        tableBody.innerHTML = '';

        this.quizzes.forEach(quiz => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${quiz.name}</td>
                <td>${quiz.course}</td>
                <td>${new Date(quiz.date_time).toLocaleString()}</td>
                <td>${quiz.duration} minutes</td>
                <td>${this.formatStatus(quiz.status)}</td>
                <td>
                    ${this.getQuizActionButton(quiz)}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    getQuizActionButton(quiz) {
        if (quiz.status === 'upcoming') {
            return `
                <button class="btn btn-sm btn-primary" onclick="quizExam.startQuiz(${quiz.id})">
                    <i class="fa fa-play"></i> Start
                </button>
            `;
        } else if (quiz.status === 'completed') {
            return `
                <button class="btn btn-sm btn-info" onclick="quizExam.viewResults(${quiz.id})">
                    <i class="fa fa-chart-bar"></i> View Results
                </button>
            `;
        } else {
            return `
                <button class="btn btn-sm btn-secondary" disabled>
                    <i class="fa fa-clock"></i> Expired
                </button>
            `;
        }
    }

    async startQuiz(quizId) {
        try {
            const response = await fetch(`/api/student/quiz/${quizId}`);
            if (response.ok) {
                this.currentQuiz = await response.json();
                this.displayQuiz();
                this.startQuizTimer();
                $('#takeQuizModal').modal('show');
            }
        } catch (error) {
            console.error('Error loading quiz:', error);
        }
    }

    displayQuiz() {
        document.getElementById('quizTitle').textContent = this.currentQuiz.name;
        document.getElementById('quizDescription').textContent = this.currentQuiz.description;
        
        const questionsContainer = document.getElementById('quizQuestions');
        questionsContainer.innerHTML = '';

        this.currentQuiz.questions.forEach((question, index) => {
            let questionHtml = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Question ${index + 1}</h5>
                        <p class="card-text">${question.text}</p>
            `;

            if (question.type === 'multiple_choice') {
                question.options.forEach((option, optionIndex) => {
                    questionHtml += `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="question_${question.id}" id="option_${question.id}_${optionIndex}" value="${optionIndex}">
                            <label class="form-check-label" for="option_${question.id}_${optionIndex}">
                                ${option}
                            </label>
                        </div>
                    `;
                });
            } else if (question.type === 'true_false') {
                questionHtml += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="question_${question.id}" id="option_${question.id}_0" value="true">
                        <label class="form-check-label" for="option_${question.id}_0">
                            True
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="question_${question.id}" id="option_${question.id}_1" value="false">
                        <label class="form-check-label" for="option_${question.id}_1">
                            False
                        </label>
                    </div>
                `;
            } else if (question.type === 'short_answer') {
                questionHtml += `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="answer_${question.id}" placeholder="Your answer">
                    </div>
                `;
            }

            questionHtml += `
                    </div>
                </div>
            `;
            questionsContainer.innerHTML += questionHtml;
        });
    }

    startQuizTimer() {
        const duration = this.currentQuiz.duration * 60; // Convert to seconds
        let timeLeft = duration;
        
        const timerElement = document.getElementById('quizTimer');
        
        this.quizTimer = setInterval(() => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(this.quizTimer);
                this.submitQuiz();
            }
            
            timeLeft--;
        }, 1000);
    }

    async submitQuiz() {
        clearInterval(this.quizTimer);
        
        const answers = {};
        
        this.currentQuiz.questions.forEach(question => {
            if (question.type === 'multiple_choice' || question.type === 'true_false') {
                const selectedOption = document.querySelector(`input[name="question_${question.id}"]:checked`);
                if (selectedOption) {
                    answers[question.id] = selectedOption.value;
                }
            } else if (question.type === 'short_answer') {
                answers[question.id] = document.getElementById(`answer_${question.id}`).value;
            }
        });
        
        try {
            const response = await fetch(`/api/student/submit-quiz/${this.currentQuiz.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers })
            });

            if (response.ok) {
                $('#takeQuizModal').modal('hide');
                alert('Quiz submitted successfully!');
                this.loadQuizzes();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to submit quiz. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    }

    viewResults(quizId) {
        // Implement quiz results viewing functionality
        console.log('Viewing quiz results:', quizId);
    }

    formatStatus(status) {
        const statusClasses = {
            'upcoming': 'badge bg-primary',
            'completed': 'badge bg-success',
            'expired': 'badge bg-danger'
        };

        const statusText = {
            'upcoming': 'Upcoming',
            'completed': 'Completed',
            'expired': 'Expired'
        };

        return `<span class="${statusClasses[status] || 'badge bg-secondary'}">${statusText[status] || status}</span>`;
    }
}

// Grades & Feedback Management
class GradesFeedback {
    constructor() {
        this.grades = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Course selection change
        document.getElementById('gradesCourseSelect').addEventListener('change', () => {
            this.loadGrades();
        });

        // Grades type selection change
        document.getElementById('gradesTypeSelect').addEventListener('change', () => {
            this.loadGrades();
        });
    }

    async loadGrades() {
        const courseId = document.getElementById('gradesCourseSelect').value;
        const gradesType = document.getElementById('gradesTypeSelect').value;

        if (!courseId || !gradesType) {
            document.getElementById('gradesContent').innerHTML = `
                <div class="alert alert-info">
                    Please select a course and type to view grades.
                </div>
            `;
            return;
        }

        try {
            const response = await fetch(`/api/student/grades?course_id=${courseId}&type=${gradesType}`);
            if (response.ok) {
                this.grades = await response.json();
                this.displayGrades();
            }
        } catch (error) {
            console.error('Error loading grades:', error);
        }
    }

    displayGrades() {
        const gradesContent = document.getElementById('gradesContent');
        
        if (this.grades.length === 0) {
            gradesContent.innerHTML = `
                <div class="alert alert-info">
                    No grades available for the selected course and type.
                </div>
            `;
            return;
        }

        let html = '';
        
        if (this.grades[0].type === 'overall') {
            html = this.displayOverallPerformance();
        } else {
            html = this.displayDetailedGrades();
        }

        gradesContent.innerHTML = html;
    }

    displayOverallPerformance() {
        const overallGrade = this.grades[0];
        
        return `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Overall Performance</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Course:</strong> ${overallGrade.course}</p>
                            <p><strong>Faculty:</strong> ${overallGrade.faculty}</p>
                            <p><strong>Semester:</strong> ${overallGrade.semester}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Grade:</strong> ${overallGrade.grade}</p>
                            <p><strong>GPA:</strong> ${overallGrade.gpa}</p>
                            <p><strong>Rank:</strong> ${overallGrade.rank} out of ${overallGrade.total_students}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h6>Performance Breakdown</h6>
                        <div class="progress mb-2">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${overallGrade.assignments_percentage}%;" aria-valuenow="${overallGrade.assignments_percentage}" aria-valuemin="0" aria-valuemax="100">Assignments: ${overallGrade.assignments_percentage}%</div>
                        </div>
                        <div class="progress mb-2">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${overallGrade.quizzes_percentage}%;" aria-valuenow="${overallGrade.quizzes_percentage}" aria-valuemin="0" aria-valuemax="100">Quizzes: ${overallGrade.quizzes_percentage}%</div>
                        </div>
                        <div class="progress mb-2">
                            <div class="progress-bar bg-warning" role="progressbar" style="width: ${overallGrade.exams_percentage}%;" aria-valuenow="${overallGrade.exams_percentage}" aria-valuemin="0" aria-valuemax="100">Exams: ${overallGrade.exams_percentage}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayDetailedGrades() {
        let html = `
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Due Date</th>
                            <th>Submission Date</th>
                            <th>Grade</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.grades.forEach(grade => {
            html += `
                <tr>
                    <td>${grade.name}</td>
                    <td>${new Date(grade.due_date).toLocaleString()}</td>
                    <td>${grade.submission_date ? new Date(grade.submission_date).toLocaleString() : 'Not submitted'}</td>
                    <td>${grade.grade || 'N/A'}</td>
                    <td>
                        ${grade.feedback ? `
                            <button class="btn btn-sm btn-info" onclick="gradesFeedback.viewFeedback(${grade.id})">
                                <i class="fa fa-comment"></i> View
                            </button>
                        ` : 'N/A'}
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        return html;
    }

    viewFeedback(gradeId) {
        // Implement feedback viewing functionality
        console.log('Viewing feedback:', gradeId);
    }
}

// Notifications Management
class Notifications {
    constructor() {
        this.notifications = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Set up WebSocket connection for real-time notifications
        this.setupWebSocket();
    }

    setupWebSocket() {
        // This is a placeholder for WebSocket setup
        // In a real implementation, you would connect to a WebSocket server
        console.log('WebSocket connection would be established here');
    }

    async loadNotifications() {
        try {
            const response = await fetch('/api/student/notifications');
            if (response.ok) {
                this.notifications = await response.json();
                this.displayNotifications();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    displayNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '';

        if (this.notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="list-group-item">
                    <p class="mb-1">No notifications available.</p>
                </div>
            `;
            return;
        }

        this.notifications.forEach(notification => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item';
            
            const timeAgo = this.getTimeAgo(new Date(notification.created_at));
            
            listItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${notification.title}</h5>
                    <small>${timeAgo}</small>
                </div>
                <p class="mb-1">${notification.content}</p>
                ${notification.link ? `
                    <a href="${notification.link}" class="btn btn-sm btn-primary mt-2">
                        <i class="fa fa-external-link-alt"></i> View Details
                    </a>
                ` : ''}
            `;
            
            notificationsList.appendChild(listItem);
        });
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return Math.floor(seconds) + ' seconds ago';
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.displayNotifications();
    }
}

// AI Course Recommendations
class CourseRecommendations {
    constructor() {
        this.recommendations = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Load recommendations when the page loads
        this.loadRecommendations();
    }

    async loadRecommendations() {
        try {
            const response = await fetch('/api/student/recommendations');
            if (response.ok) {
                this.recommendations = await response.json();
                this.displayRecommendations();
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    displayRecommendations() {
        const container = document.getElementById('recommendedCourses');
        container.innerHTML = '';

        this.recommendations.forEach(course => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text">${course.description}</p>
                        <p class="card-text"><small class="text-muted">Match Score: ${course.matchScore}%</small></p>
                        <button class="btn btn-primary" onclick="courseEnrollment.enrollInCourse(${course.id})">
                            Enroll Now
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// Gamification & Leaderboard
class Gamification {
    constructor() {
        this.achievements = [];
        this.leaderboard = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.loadAchievements();
        this.loadLeaderboard();
    }

    async loadAchievements() {
        try {
            const response = await fetch('/api/student/achievements');
            if (response.ok) {
                this.achievements = await response.json();
                this.displayAchievements();
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    async loadLeaderboard() {
        try {
            const response = await fetch('/api/student/leaderboard');
            if (response.ok) {
                this.leaderboard = await response.json();
                this.displayLeaderboard();
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
    }

    displayAchievements() {
        const container = document.getElementById('achievementsList');
        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'col-md-4 mb-3';
            badge.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fa ${achievement.icon} fa-3x mb-2 ${achievement.unlocked ? 'text-primary' : 'text-muted'}"></i>
                        <h5 class="card-title">${achievement.name}</h5>
                        <p class="card-text">${achievement.description}</p>
                        <span class="badge ${achievement.unlocked ? 'bg-success' : 'bg-secondary'}">
                            ${achievement.unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                    </div>
                </div>
            `;
            container.appendChild(badge);
        });
    }

    displayLeaderboard() {
        const tableBody = document.getElementById('leaderboardTableBody');
        tableBody.innerHTML = '';

        this.leaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.studentName}</td>
                <td>${entry.points}</td>
                <td>${entry.level}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Offline Access
class OfflineAccess {
    constructor() {
        this.materials = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('offlineCourseSelect').addEventListener('change', () => this.loadMaterials());
        document.getElementById('offlineMaterialType').addEventListener('change', () => this.loadMaterials());
    }

    async loadMaterials() {
        const courseId = document.getElementById('offlineCourseSelect').value;
        const materialType = document.getElementById('offlineMaterialType').value;

        if (!courseId || !materialType) return;

        try {
            const response = await fetch(`/api/student/offline-materials?course_id=${courseId}&type=${materialType}`);
            if (response.ok) {
                this.materials = await response.json();
                this.displayMaterials();
            }
        } catch (error) {
            console.error('Error loading offline materials:', error);
        }
    }

    displayMaterials() {
        const tableBody = document.getElementById('offlineMaterialsTableBody');
        tableBody.innerHTML = '';

        this.materials.forEach(material => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${material.name}</td>
                <td>${material.type}</td>
                <td>${this.formatFileSize(material.size)}</td>
                <td>${new Date(material.lastUpdated).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="offlineAccess.downloadMaterial(${material.id})">
                        <i class="fa fa-download"></i> Download
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async downloadMaterial(materialId) {
        try {
            const response = await fetch(`/api/student/download-material/${materialId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.materials.find(m => m.id === materialId).name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        } catch (error) {
            console.error('Error downloading material:', error);
        }
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

// Student-Faculty Chat
class Chat {
    constructor() {
        this.faculty = [];
        this.currentChat = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.loadFaculty();
        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
    }

    async loadFaculty() {
        try {
            const response = await fetch('/api/student/faculty');
            if (response.ok) {
                this.faculty = await response.json();
                this.displayFaculty();
            }
        } catch (error) {
            console.error('Error loading faculty:', error);
        }
    }

    displayFaculty() {
        const container = document.getElementById('facultyList');
        container.innerHTML = '';

        this.faculty.forEach(faculty => {
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'list-group-item list-group-item-action';
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${faculty.name}</h5>
                    <small class="text-${faculty.online ? 'success' : 'secondary'}">
                        ${faculty.online ? 'Online' : 'Offline'}
                    </small>
                </div>
                <p class="mb-1">${faculty.department}</p>
            `;
            item.addEventListener('click', () => this.startChat(faculty.id));
            container.appendChild(item);
        });
    }

    async startChat(facultyId) {
        this.currentChat = facultyId;
        document.getElementById('chatMessages').innerHTML = '';
        await this.loadChatHistory();
    }

    async loadChatHistory() {
        if (!this.currentChat) return;

        try {
            const response = await fetch(`/api/student/chat-history/${this.currentChat}`);
            if (response.ok) {
                const messages = await response.json();
                this.displayMessages(messages);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    displayMessages(messages) {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';

        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.sender === 'student' ? 'text-end' : 'text-start'} mb-2`;
            messageDiv.innerHTML = `
                <div class="d-inline-block p-2 rounded ${message.sender === 'student' ? 'bg-primary text-white' : 'bg-light'}">
                    ${message.content}
                </div>
                <small class="text-muted d-block">${new Date(message.timestamp).toLocaleString()}</small>
            `;
            container.appendChild(messageDiv);
        });
        container.scrollTop = container.scrollHeight;
    }

    async sendMessage() {
        if (!this.currentChat) return;

        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        if (!content) return;

        try {
            const response = await fetch('/api/student/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    facultyId: this.currentChat,
                    content: content
                })
            });

            if (response.ok) {
                input.value = '';
                await this.loadChatHistory();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

// Plagiarism Detection
class PlagiarismDetection {
    constructor() {
        this.assignments = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.loadAssignments();
        document.getElementById('checkPlagiarismBtn').addEventListener('click', () => this.checkPlagiarism());
    }

    async loadAssignments() {
        try {
            const response = await fetch('/api/student/assignments');
            if (response.ok) {
                this.assignments = await response.json();
                this.populateAssignmentSelect();
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
    }

    populateAssignmentSelect() {
        const select = document.getElementById('plagiarismAssignmentSelect');
        select.innerHTML = '<option value="">Select Assignment</option>';

        this.assignments.forEach(assignment => {
            const option = document.createElement('option');
            option.value = assignment.id;
            option.textContent = assignment.name;
            select.appendChild(option);
        });
    }

    async checkPlagiarism() {
        const assignmentId = document.getElementById('plagiarismAssignmentSelect').value;
        if (!assignmentId) return;

        try {
            const response = await fetch(`/api/student/check-plagiarism/${assignmentId}`);
            if (response.ok) {
                const result = await response.json();
                this.displayPlagiarismResults(result);
            }
        } catch (error) {
            console.error('Error checking plagiarism:', error);
        }
    }

    displayPlagiarismResults(result) {
        const container = document.getElementById('plagiarismResults');
        const scoreElement = document.getElementById('plagiarismScore');
        const detailsElement = document.getElementById('plagiarismDetails');

        scoreElement.innerHTML = `
            <div class="progress mb-3">
                <div class="progress-bar ${this.getScoreColor(result.score)}" 
                     role="progressbar" 
                     style="width: ${result.score}%" 
                     aria-valuenow="${result.score}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                    ${result.score}% Original
                </div>
            </div>
        `;

        detailsElement.innerHTML = result.matches.map(match => `
            <div class="mb-2">
                <strong>Match Found:</strong> ${match.source}<br>
                <strong>Similarity:</strong> ${match.similarity}%<br>
                <strong>Location:</strong> ${match.location}
            </div>
        `).join('');

        container.style.display = 'block';
    }

    getScoreColor(score) {
        if (score >= 90) return 'bg-success';
        if (score >= 70) return 'bg-warning';
        return 'bg-danger';
    }
}

// Initialize all managers
const studentProfile = new StudentProfile();
const courseEnrollment = new CourseEnrollment();
const lectureAccess = new LectureAccess();
const assignmentSubmission = new AssignmentSubmission();
const quizExam = new QuizExam();
const gradesFeedback = new GradesFeedback();
const notifications = new Notifications();

// Initialize new managers
const courseRecommendations = new CourseRecommendations();
const gamification = new Gamification();
const offlineAccess = new OfflineAccess();
const chat = new Chat();
const plagiarismDetection = new PlagiarismDetection();

// Load initial data when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide spinner
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('show');
    
    // Load student profile
    studentProfile.loadProfile();
    
    // Load enrolled courses
    courseEnrollment.loadEnrolledCourses();
    
    // Load available courses
    courseEnrollment.loadAvailableCourses();
    
    // Load assignments
    assignmentSubmission.loadAssignments();
    
    // Load notifications
    notifications.loadNotifications();
}); 