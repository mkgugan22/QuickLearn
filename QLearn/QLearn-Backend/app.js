const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors()); 
app.use(express.json());

// Import your routes
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

// MongoDB Atlas connection (direct)
mongoose.connect('mongodb+srv://harivarshinisr:W0LGfYTndADWxi8g@cluster0.vzc65q1.mongodb.net/student-course?retryWrites=true&w=majority')
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Use routes
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
