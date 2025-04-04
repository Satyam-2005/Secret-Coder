// User Management
class UserManager {
    constructor() {
        this.users = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('createUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
    }

    async createUser() {
        const form = document.getElementById('createUserForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const user = await response.json();
                this.users.push(user);
                this.updateUserTable();
                $('#createUserModal').modal('hide');
                form.reset();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    updateUserTable() {
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="userManager.editUser(${user.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="userManager.deleteUser(${user.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Course Management
class CourseManager {
    constructor() {
        this.courses = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
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
                <td>${course.faculty}</td>
                <td>${course.enrolledStudents}</td>
                <td>${course.status}</td>
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

// Report Generation
class ReportGenerator {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('reportType').addEventListener('change', () => {
            this.updateReportContent();
        });
    }

    async generateReport() {
        const reportType = document.getElementById('reportType').value;
        if (!reportType) return;

        try {
            const response = await fetch(`/api/reports/${reportType}`);
            if (response.ok) {
                const report = await response.json();
                this.displayReport(report);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    }

    displayReport(report) {
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '';

        // Create report table
        const table = document.createElement('table');
        table.className = 'table table-bordered';
        
        // Add headers
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                ${Object.keys(report[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
        `;
        table.appendChild(thead);

        // Add data
        const tbody = document.createElement('tbody');
        report.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = Object.values(row).map(value => `<td>${value}</td>`).join('');
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        reportContent.appendChild(table);
    }
}

// System Monitoring
class SystemMonitor {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Refresh stats every 5 minutes
        setInterval(() => this.updateStats(), 300000);
    }

    async updateStats() {
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                const stats = await response.json();
                this.displayStats(stats);
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    displayStats(stats) {
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('activeCourses').textContent = stats.activeCourses;
        document.getElementById('totalAssignments').textContent = stats.totalAssignments;
    }

    async updateSupportRequests() {
        try {
            const response = await fetch('/api/support-requests');
            if (response.ok) {
                const requests = await response.json();
                this.displaySupportRequests(requests);
            }
        } catch (error) {
            console.error('Error updating support requests:', error);
        }
    }

    displaySupportRequests(requests) {
        const tableBody = document.getElementById('supportTableBody');
        tableBody.innerHTML = '';

        requests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.userName}</td>
                <td>${request.issue}</td>
                <td>${request.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="systemMonitor.handleRequest(${request.id})">
                        <i class="fa fa-hand-paper"></i> Handle
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Notifications & Reminders
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Handle notification form submission
        document.getElementById('createNotificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNotification();
        });

        // Show/hide scheduled datetime field based on schedule selection
        document.querySelector('select[name="schedule"]').addEventListener('change', (e) => {
            const scheduledDateTimeField = document.querySelector('.scheduled-datetime');
            if (e.target.value === 'scheduled') {
                scheduledDateTimeField.style.display = 'block';
            } else {
                scheduledDateTimeField.style.display = 'none';
            }
        });
    }

    async createNotification() {
        const form = document.getElementById('createNotificationForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const notification = await response.json();
                this.notifications.push(notification);
                this.updateNotificationTable();
                $('#createNotificationModal').modal('hide');
                form.reset();
                document.querySelector('.scheduled-datetime').style.display = 'none';
            }
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    }

    updateNotificationTable() {
        const tableBody = document.getElementById('notificationTableBody');
        tableBody.innerHTML = '';

        this.notifications.forEach(notification => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${notification.title}</td>
                <td>${this.formatNotificationType(notification.type)}</td>
                <td>${this.formatTargetAudience(notification.target_audience)}</td>
                <td>${this.formatSchedule(notification.schedule, notification.scheduled_datetime)}</td>
                <td>${notification.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="notificationManager.editNotification(${notification.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="notificationManager.deleteNotification(${notification.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    formatNotificationType(type) {
        const types = {
            'class': 'Class Reminder',
            'assignment': 'Assignment Reminder',
            'exam': 'Exam Reminder',
            'general': 'General Notification'
        };
        return types[type] || type;
    }

    formatTargetAudience(audience) {
        const audiences = {
            'all': 'All Users',
            'students': 'Students Only',
            'faculty': 'Faculty Only'
        };
        return audiences[audience] || audience;
    }

    formatSchedule(schedule, scheduledDatetime) {
        if (schedule === 'immediate') {
            return 'Immediate';
        } else if (schedule === 'scheduled' && scheduledDatetime) {
            return new Date(scheduledDatetime).toLocaleString();
        }
        return schedule;
    }

    async editNotification(id) {
        // Implementation for editing notification
        console.log('Edit notification:', id);
    }

    async deleteNotification(id) {
        if (confirm('Are you sure you want to delete this notification?')) {
            try {
                const response = await fetch(`/api/notifications/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.notifications = this.notifications.filter(n => n.id !== id);
                    this.updateNotificationTable();
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    }
}

// Announcements
class AnnouncementManager {
    constructor() {
        this.announcements = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('createAnnouncementForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAnnouncement();
        });
    }

    async createAnnouncement() {
        const form = document.getElementById('createAnnouncementForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/announcements', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const announcement = await response.json();
                this.announcements.push(announcement);
                this.updateAnnouncementTable();
                $('#createAnnouncementModal').modal('hide');
                form.reset();
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    }

    updateAnnouncementTable() {
        const tableBody = document.getElementById('announcementTableBody');
        tableBody.innerHTML = '';

        this.announcements.forEach(announcement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${announcement.title}</td>
                <td>${announcement.targetAudience}</td>
                <td>${new Date(announcement.date).toLocaleString()}</td>
                <td>${announcement.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="announcementManager.editAnnouncement(${announcement.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="announcementManager.deleteAnnouncement(${announcement.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Initialize managers
const userManager = new UserManager();
const courseManager = new CourseManager();
const reportGenerator = new ReportGenerator();
const systemMonitor = new SystemMonitor();
const notificationManager = new NotificationManager();
const announcementManager = new AnnouncementManager();

// Load initial data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load users
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
            userManager.users = await usersResponse.json();
            userManager.updateUserTable();
        }

        // Load courses
        const coursesResponse = await fetch('/api/courses');
        if (coursesResponse.ok) {
            courseManager.courses = await coursesResponse.json();
            courseManager.updateCourseTable();
        }

        // Load notifications
        const notificationsResponse = await fetch('/api/notifications');
        if (notificationsResponse.ok) {
            notificationManager.notifications = await notificationsResponse.json();
            notificationManager.updateNotificationTable();
        }

        // Load announcements
        const announcementsResponse = await fetch('/api/announcements');
        if (announcementsResponse.ok) {
            announcementManager.announcements = await announcementsResponse.json();
            announcementManager.updateAnnouncementTable();
        }

        // Update system stats and support requests
        systemMonitor.updateStats();
        systemMonitor.updateSupportRequests();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}); 