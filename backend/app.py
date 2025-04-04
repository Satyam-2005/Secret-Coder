from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///elearning.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'faculty', or 'student'
    status = db.Column(db.String(20), default='active')  # 'active' or 'inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    submissions = db.relationship('Submission', backref='student', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='active')  # 'active' or 'inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    materials = db.relationship('CourseMaterial', backref='course', lazy=True)
    assignments = db.relationship('Assignment', backref='course', lazy=True)
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)

class CourseMaterial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    submissions = db.relationship('Submission', backref='assignment', lazy=True)

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    grade = db.Column(db.Integer)
    feedback = db.Column(db.Text)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')  # 'active' or 'completed'

class SupportRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    issue = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'in_progress', or 'resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    target_audience = db.Column(db.String(20), nullable=False)  # 'all', 'students', or 'faculty'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')  # 'active' or 'inactive'

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'class', 'assignment', 'exam', or 'general'
    target_audience = db.Column(db.String(20), nullable=False)  # 'all', 'students', or 'faculty'
    schedule = db.Column(db.String(20), nullable=False)  # 'immediate' or 'scheduled'
    scheduled_datetime = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'sent', or 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sent_at = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # For user-specific notifications

# Create tables
with app.app_context():
    db.create_all()

# Admin Routes
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'status': user.status
    } for user in users])

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.form
    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'status': user.status
    })

@app.route('/api/reports/<report_type>', methods=['GET'])
def generate_report(report_type):
    if report_type == 'student':
        # Student performance report
        submissions = Submission.query.all()
        return jsonify([{
            'student_name': submission.student.name,
            'assignment_name': submission.assignment.name,
            'course_name': submission.assignment.course.name,
            'submission_date': submission.submitted_at.isoformat(),
            'grade': submission.grade
        } for submission in submissions])
    
    elif report_type == 'course':
        # Course progress report
        courses = Course.query.all()
        return jsonify([{
            'course_name': course.name,
            'faculty_name': User.query.get(course.faculty_id).name,
            'enrolled_students': len(course.enrollments),
            'active_assignments': len(course.assignments)
        } for course in courses])
    
    elif report_type == 'faculty':
        # Faculty activity report
        faculty = User.query.filter_by(role='faculty').all()
        return jsonify([{
            'faculty_name': user.name,
            'courses_teaching': len(Course.query.filter_by(faculty_id=user.id).all()),
            'total_assignments': len(Assignment.query.join(Course).filter(Course.faculty_id == user.id).all())
        } for user in faculty])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'totalUsers': User.query.count(),
        'activeCourses': Course.query.filter_by(status='active').count(),
        'totalAssignments': Assignment.query.count()
    })

@app.route('/api/support-requests', methods=['GET'])
def get_support_requests():
    requests = SupportRequest.query.all()
    return jsonify([{
        'id': request.id,
        'userName': User.query.get(request.user_id).name,
        'issue': request.issue,
        'status': request.status,
        'createdAt': request.created_at.isoformat()
    } for request in requests])

@app.route('/api/support-requests/<int:request_id>', methods=['POST'])
def handle_support_request(request_id):
    data = request.json
    support_request = SupportRequest.query.get_or_404(request_id)
    
    support_request.status = data['status']
    if data['status'] == 'resolved':
        support_request.resolved_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Support request updated successfully'})

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.all()
    return jsonify([{
        'id': announcement.id,
        'title': announcement.title,
        'content': announcement.content,
        'targetAudience': announcement.target_audience,
        'date': announcement.created_at.isoformat(),
        'status': announcement.status
    } for announcement in announcements])

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    data = request.form
    announcement = Announcement(
        title=data['title'],
        content=data['content'],
        target_audience=data['target_audience']
    )
    
    db.session.add(announcement)
    db.session.commit()
    
    return jsonify({
        'id': announcement.id,
        'title': announcement.title,
        'content': announcement.content,
        'targetAudience': announcement.target_audience,
        'date': announcement.created_at.isoformat(),
        'status': announcement.status
    })

# Notification Routes
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.query.all()
    return jsonify([{
        'id': notification.id,
        'title': notification.title,
        'content': notification.content,
        'type': notification.type,
        'target_audience': notification.target_audience,
        'schedule': notification.schedule,
        'scheduled_datetime': notification.scheduled_datetime.isoformat() if notification.scheduled_datetime else None,
        'status': notification.status,
        'created_at': notification.created_at.isoformat(),
        'sent_at': notification.sent_at.isoformat() if notification.sent_at else None
    } for notification in notifications])

@app.route('/api/notifications', methods=['POST'])
def create_notification():
    data = request.form
    
    notification = Notification(
        title=data['title'],
        content=data['content'],
        type=data['type'],
        target_audience=data['target_audience'],
        schedule=data['schedule']
    )
    
    if data['schedule'] == 'scheduled' and 'scheduled_datetime' in data:
        notification.scheduled_datetime = datetime.fromisoformat(data['scheduled_datetime'])
    
    db.session.add(notification)
    db.session.commit()
    
    # If immediate notification, send it right away
    if notification.schedule == 'immediate':
        send_notification(notification)
    
    return jsonify({
        'id': notification.id,
        'title': notification.title,
        'content': notification.content,
        'type': notification.type,
        'target_audience': notification.target_audience,
        'schedule': notification.schedule,
        'scheduled_datetime': notification.scheduled_datetime.isoformat() if notification.scheduled_datetime else None,
        'status': notification.status,
        'created_at': notification.created_at.isoformat()
    })

@app.route('/api/notifications/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    
    db.session.delete(notification)
    db.session.commit()
    
    return jsonify({'message': 'Notification deleted successfully'})

def send_notification(notification):
    """
    Send a notification to the target audience.
    This is a placeholder function that would be implemented with actual notification sending logic.
    """
    # Update notification status
    notification.status = 'sent'
    notification.sent_at = datetime.utcnow()
    db.session.commit()
    
    # Here you would implement the actual notification sending logic
    # For example, sending emails, push notifications, etc.
    print(f"Notification sent: {notification.title} to {notification.target_audience}")

# Course Management Routes
@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{
        'id': course.id,
        'name': course.name,
        'description': course.description,
        'faculty': User.query.get(course.faculty_id).name,
        'enrolledStudents': len(course.enrollments),
        'status': course.status
    } for course in courses])

@app.route('/api/courses', methods=['POST'])
def create_course():
    data = request.form
    files = request.files.getlist('materials')
    
    course = Course(
        name=data['name'],
        description=data['description'],
        faculty_id=data['faculty_id']
    )
    db.session.add(course)
    db.session.commit()

    # Handle course materials
    for file in files:
        if file:
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'courses', str(course.id), filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            file.save(file_path)
            
            material = CourseMaterial(
                course_id=course.id,
                file_name=filename,
                file_path=file_path
            )
            db.session.add(material)
    
    db.session.commit()
    return jsonify({
        'id': course.id,
        'name': course.name,
        'description': course.description,
        'faculty': User.query.get(course.faculty_id).name,
        'status': course.status
    })

# Assignment Management Routes
@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    assignments = Assignment.query.all()
    return jsonify([{
        'id': assignment.id,
        'name': assignment.name,
        'courseName': assignment.course.name,
        'dueDate': assignment.due_date.isoformat(),
        'status': 'active'  # This should be calculated based on due date
    } for assignment in assignments])

@app.route('/api/assignments', methods=['POST'])
def create_assignment():
    data = request.form
    file = request.files['file']
    
    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'assignments', filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        
        assignment = Assignment(
            course_id=data['course_id'],
            name=data['name'],
            description=data['description'],
            due_date=datetime.fromisoformat(data['due_date']),
            file_path=file_path
        )
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'id': assignment.id,
            'name': assignment.name,
            'courseName': assignment.course.name,
            'dueDate': assignment.due_date.isoformat()
        })

# Performance Tracking Routes
@app.route('/api/performance', methods=['GET'])
def get_performance():
    course_id = request.args.get('courseId')
    assignment_id = request.args.get('assignmentId')
    
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    return jsonify([{
        'id': submission.id,
        'studentName': submission.student.name,
        'assignmentName': submission.assignment.name,
        'submissionDate': submission.submitted_at.isoformat(),
        'grade': submission.grade
    } for submission in submissions])

@app.route('/api/submissions/<int:submission_id>/grade', methods=['POST'])
def grade_submission(submission_id):
    data = request.json
    submission = Submission.query.get_or_404(submission_id)
    
    submission.grade = data['grade']
    db.session.commit()
    
    return jsonify({'message': 'Grade updated successfully'})

if __name__ == '__main__':
    app.run(debug=True) 