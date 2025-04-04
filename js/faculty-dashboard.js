// Course Management
class CourseManager {
    constructor() {
        this.courses = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Create Course Form
        document.getElementById('createCourseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCourse();
        });
    }

    async createCourse() {
        const form = document.getElementById('createCourseForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const course = await response.json();
                this.courses.push(course);
                this.updateCourseTable();
                $('#createCourseModal').modal('hide');
                form.reset();
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    }

    updateCourseTable() {
        const tableBody = document.getElementById('courseTableBody');
        tableBody.innerHTML = '';

        this.courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.description}</td>
                <td>${course.enrolledStudents}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="courseManager.editCourse(${course.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="courseManager.deleteCourse(${course.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Assignment Management
class AssignmentManager {
    constructor() {
        this.assignments = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Create Assignment Form
        document.getElementById('createAssignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAssignment();
        });
    }

    async createAssignment() {
        const form = document.getElementById('createAssignmentForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/assignments', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const assignment = await response.json();
                this.assignments.push(assignment);
                this.updateAssignmentTable();
                $('#createAssignmentModal').modal('hide');
                form.reset();
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    }

    updateAssignmentTable() {
        const tableBody = document.getElementById('assignmentTableBody');
        tableBody.innerHTML = '';

        this.assignments.forEach(assignment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${assignment.name}</td>
                <td>${assignment.courseName}</td>
                <td>${new Date(assignment.dueDate).toLocaleString()}</td>
                <td>${assignment.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="assignmentManager.editAssignment(${assignment.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="assignmentManager.deleteAssignment(${assignment.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Student Performance Tracking
class PerformanceTracker {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Course and Assignment Select
        document.getElementById('courseSelect').addEventListener('change', () => this.updatePerformanceTable());
        document.getElementById('assignmentSelect').addEventListener('change', () => this.updatePerformanceTable());
    }

    async updatePerformanceTable() {
        const courseId = document.getElementById('courseSelect').value;
        const assignmentId = document.getElementById('assignmentSelect').value;
        
        if (!courseId || !assignmentId) return;

        try {
            const response = await fetch(`/api/performance?courseId=${courseId}&assignmentId=${assignmentId}`);
            if (response.ok) {
                const performances = await response.json();
                this.displayPerformances(performances);
            }
        } catch (error) {
            console.error('Error fetching performance data:', error);
        }
    }

    displayPerformances(performances) {
        const tableBody = document.getElementById('performanceTableBody');
        tableBody.innerHTML = '';

        performances.forEach(performance => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${performance.studentName}</td>
                <td>${performance.assignmentName}</td>
                <td>${new Date(performance.submissionDate).toLocaleString()}</td>
                <td>${performance.grade || 'Not graded'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="performanceTracker.gradeSubmission(${performance.id})">
                        <i class="fa fa-star"></i> Grade
                    </button>
                    <button class="btn btn-sm btn-info" onclick="performanceTracker.viewSubmission(${performance.id})">
                        <i class="fa fa-eye"></i> View
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async gradeSubmission(submissionId) {
        // Implement grading functionality
        const grade = prompt('Enter grade (0-100):');
        if (grade && !isNaN(grade) && grade >= 0 && grade <= 100) {
            try {
                const response = await fetch(`/api/submissions/${submissionId}/grade`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ grade: parseInt(grade) })
                });
                
                if (response.ok) {
                    this.updatePerformanceTable();
                }
            } catch (error) {
                console.error('Error grading submission:', error);
            }
        }
    }
}

// Initialize managers
const courseManager = new CourseManager();
const assignmentManager = new AssignmentManager();
const performanceTracker = new PerformanceTracker();

// Load initial data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load courses
        const coursesResponse = await fetch('/api/courses');
        if (coursesResponse.ok) {
            courseManager.courses = await coursesResponse.json();
            courseManager.updateCourseTable();
        }

        // Load assignments
        const assignmentsResponse = await fetch('/api/assignments');
        if (assignmentsResponse.ok) {
            assignmentManager.assignments = await assignmentsResponse.json();
            assignmentManager.updateAssignmentTable();
        }

        // Populate course select
        const courseSelect = document.getElementById('courseSelect');
        courseManager.courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });

        // Populate assignment select
        const assignmentSelect = document.getElementById('assignmentSelect');
        assignmentManager.assignments.forEach(assignment => {
            const option = document.createElement('option');
            option.value = assignment.id;
            option.textContent = assignment.name;
            assignmentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}); 