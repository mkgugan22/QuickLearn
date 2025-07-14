# 🎓 Student-Course Management App
 
An end-to-end web application for managing courses and modules, built with Angular (frontend) and a RESTful backend (Node.js + Express + MongoDB).
 
---
 
## 🚀 Features
 
- **Course Management**
  - List courses with sorting, pagination, and search
  - Add, edit, and delete courses
  - Date validation: ensures enrollment dates are valid and at least 4 days apart
  - Instructor dropdown populated dynamically
 
- **Module Management**
  - Add dynamic modules (title + description) via a dialog
  - View course modules
  - Validation: prevents saving unless all module fields are filled
 
- **User Feedback**
  - Snackbar notifications for success/error and validation feedback
  - Dialogs for delete confirmation and module input
 
- **Role-based UI**
  - Admins (non-Student roles) can manage courses/modules
  - Students have a read-only view (disable creation/editing features)
 
---
 
## 🧩 Tech Stack
 
### Frontend
- Angular 15+
- Angular Material (`MatTable`, `MatDialog`, `MatPaginator`, `MatSort`)
- Reactive forms with template-driven pattern validation
- Snackbar for user notifications
 
### Backend (assumed)
- Node.js + Express
- MongoDB (with `enrollPeriod` stored as `{startDate, endDate}`)
- REST API for `getCourses`, `addCourse`, `updateCourse`, `deleteCourse`, `getInstructor`
 
---
 
## 📦 Installation
 
```bash
git clone https://github.com/Gokula-Krishnan-20/student-course.git
cd student-course
Frontend setup:
cd frontend
npm install
ng serve --open
Frontend default: http://localhost:4200
 
Backend setup (assuming /backend folder exists)
cd backend
npm install
npm run dev
API default: http://localhost:3000/api/
 
⚙️ Configuration
Create a .env in the backend folder:
 
env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/student-course
✅ Usage
Log in as Admin (role saved in localStorage).
 
Add a new course: fill in all fields, pick valid enrollment dates, and click Add New Course → module dialog pops up → add at least one module and Save.
 
Validate that the course appears in the table with all details.
 
Edit a course: click Edit → modify values → Save.
 
Delete a course: click Delete → confirm in dialog.
 
Try saving with empty or invalid fields to trigger validation feedback.
 
🔒 Form & Business Validations
Course Fields: require non-empty values; fields like courseName, courseCode, and department must not be just numbers or symbols.
 
Enrollment Dates:
 
Both are required
 
Start date ≥ today
 
End date > Start date + minimum 4 days
 
Module Dialog: blocks Save unless every module has a title and description filled.
 
🛠️ Validation Implementation (Angular side)
Template checks (*ngIf="r._editing" blocks rendering input vs readonly)
 
validateEnrollmentDates() in CourseComponent
 
In DialogComponent: optionally use Angular form or template checks before saveModules()
 
Simple patterns (e.g. /^[A-Za-z0-9 ]+$/) can be added for fields like course name or code
 
🌱 Future Enhancements
Migrate to ReactiveForms for stronger validation & cleaner control
 
Add CRUD views for Instructors
 
Support user login with JWT and guarded routes
 
Student dashboard for enrollment and viewing own courses
 
Dockerize backend and enable CI/CD (GitHub Actions)
 
Unit testing for components and services
 
🤝 Contributing
Fork this repo
 
Create a feature branch: git checkout -b feature/YourFeature
 
Commit your changes
 
Push the branch
 
Open a PR, referencing the issue it fixes
"# QLearn" 
