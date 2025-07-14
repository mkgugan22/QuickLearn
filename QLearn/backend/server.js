const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

mongoose.connect(
 'mongodb+srv://harivarshinisr:W0LGfYTndADWxi8g@cluster0.vzc65q1.mongodb.net/student-course?retryWrites=true&w=majority')
.then(() => console.log(' MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' });

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

app.listen(3700, () => {
  console.log('🚀 Server running at http://localhost:3700');
});

const instructorRoutes = require('./routes/instructor');
app.use('/api/instructors', instructorRoutes);


const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);


/* all course */
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

/* student */
const studentRoutes = require('./routes/studentRoutes');
app.use('/api', studentRoutes);


const userRoutes = require('./routes/dashboard');
app.use('/api', userRoutes);