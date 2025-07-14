# 🎓 QuickLearn - Advanced Student Course Management System

A comprehensive full-stack web application for managing courses, students, and educational content. Built with Angular frontend and Node.js backend with MongoDB database.

## 🌟 Features

### 📚 Course Management
- **Course CRUD Operations**: Create, read, update, and delete courses
- **Advanced Filtering**: Sort, search, and paginate through courses
- **Enrollment Management**: Handle student enrollments with date validation
- **Module System**: Dynamic course modules with rich content support
- **Instructor Management**: Comprehensive instructor profiles and assignments

### 👨‍🎓 Student Management
- **User Authentication**: Secure login/logout with JWT tokens
- **Role-based Access**: Different permissions for students, instructors, and admins
- **Student Profiles**: Complete student information management
- **Enrollment Tracking**: Track student progress and course completions

### 📊 Advanced Features
- **Analytics Dashboard**: Course statistics and student performance metrics
- **File Upload System**: Support for course materials and documents
- **PDF Processing**: Extract and process PDF course materials
- **Audio Integration**: Text-to-speech functionality for course content
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt password hashing
- **Role-based Authorization**: Admin, instructor, and student roles
- **Session Management**: Secure session handling

## 🛠️ Tech Stack

### Frontend (Angular)
- **Framework**: Angular 19.2.x
- **UI Components**: Angular Material, ng-bootstrap
- **Styling**: Bootstrap 5.3.x, AOS animations
- **Charts**: Chart.js, ECharts, Highcharts
- **Authentication**: JWT decode, secure routing
- **Additional**: ngx-toastr, ngx-pagination, ngx-infinite-scroll

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt for password hashing
- **File Processing**: Multer for uploads, PDF-parse for document processing
- **External APIs**: Google Cloud Text-to-Speech
- **Security**: CORS, body-parser for request handling

### Database
- **Primary**: MongoDB for main application data
- **Models**: User, Course, Student, Instructor, Module schemas
- **Features**: Relationship management, indexing, validation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Angular CLI (`npm install -g @angular/cli`)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mkgugan22/QuickLearn.git
cd QuickLearn
```

### 2. Backend Setup

#### Main Backend
```bash
cd QLearn/backend
npm install
```

Create `.env` file in `QLearn/backend/`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quicklearn
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_KEYFILE=path/to/your/service-account-key.json
```

#### Authentication Backend
```bash
cd QLearn/auth-backend
npm install
```

Create `.env` file in `QLearn/auth-backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quicklearn-auth
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
cd QLearn/QLearn
npm install
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS/Linux
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

## 🚀 Running the Application

### Start Backend Services
```bash
# Terminal 1: Main Backend
cd QLearn/backend
node server.js

# Terminal 2: Auth Backend
cd QLearn/auth-backend
npm start
```

### Start Frontend
```bash
# Terminal 3: Angular Frontend
cd QLearn/QLearn
ng serve
```

### Access the Application
- **Frontend**: http://localhost:4200
- **Main Backend API**: http://localhost:3000
- **Auth Backend API**: http://localhost:5000

## 📁 Project Structure

```
QuickLearn/
├── QLearn/
│   ├── QLearn/                 # Angular Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── guards/
│   │   │   │   └── models/
│   │   │   ├── assets/
│   │   │   └── environments/
│   │   ├── angular.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/                # Main Backend
│   │   ├── models/
│   │   │   ├── Course.js
│   │   │   ├── Student.js
│   │   │   ├── Instructor.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   ├── uploads/
│   │   ├── server.js
│   │   └── package.json
│   │
│   ├── auth-backend/           # Authentication Backend
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── package.json
│   │
│   └── QLearn-Backend/         # Additional Backend Services
│
├── README.md
├── .gitignore
└── package.json
```

## 🎯 Key Features Explained

### Course Management System
- **Dynamic Module Creation**: Add unlimited modules to courses with rich content
- **Enrollment Validation**: Automatic validation of enrollment dates (minimum 4 days apart)
- **Instructor Assignment**: Dynamic instructor dropdown with real-time data
- **File Upload Support**: Upload course materials, PDFs, and media files

### User Authentication Flow
1. User registration with role selection
2. JWT token generation and validation
3. Role-based route protection
4. Secure session management

### Student Dashboard
- **Course Enrollment**: Browse and enroll in available courses
- **Progress Tracking**: Monitor course completion and progress
- **Material Access**: Download course materials and resources
- **Grade Management**: View grades and feedback

### Admin Panel
- **User Management**: Create, update, and delete users
- **Course Oversight**: Monitor all courses and enrollments
- **Analytics**: View system statistics and reports
- **Content Management**: Manage course content and materials

## 🔧 API Endpoints

### Authentication APIs
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Course APIs
```
GET    /api/courses        # Get all courses
POST   /api/courses        # Create new course
GET    /api/courses/:id    # Get specific course
PUT    /api/courses/:id    # Update course
DELETE /api/courses/:id    # Delete course
```

### Student APIs
```
GET    /api/students       # Get all students
POST   /api/students       # Create new student
GET    /api/students/:id   # Get specific student
PUT    /api/students/:id   # Update student
DELETE /api/students/:id   # Delete student
```

### Enrollment APIs
```
POST   /api/enrollments    # Enroll student in course
GET    /api/enrollments    # Get all enrollments
DELETE /api/enrollments/:id # Remove enrollment
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Role-based Access Control**: Different permissions for different user types
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file handling with type validation

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (admin/instructor/student),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```javascript
{
  _id: ObjectId,
  courseName: String,
  courseCode: String,
  department: String,
  instructor: ObjectId (ref: Instructor),
  enrollmentPeriod: {
    startDate: Date,
    endDate: Date
  },
  modules: [{
    title: String,
    description: String,
    materials: [String]
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Run Frontend Tests
```bash
cd QLearn/QLearn
ng test
```

### Run Backend Tests
```bash
cd QLearn/backend
npm test
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd QLearn/QLearn
ng build --prod
```

### Backend Deployment
Set up environment variables and deploy to your preferred platform (Heroku, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- **mkgugan22** - *Initial work* - [GitHub](https://github.com/mkgugan22)

## 🙏 Acknowledgments

- Angular team for the excellent framework
- MongoDB for the flexible database solution
- Express.js for the robust backend framework
- All contributors who helped improve this project

## 📞 Support

For support, email mkgugan22@gmail.com or create an issue in the GitHub repository.

---

**Happy Learning with QuickLearn! 🎓**
