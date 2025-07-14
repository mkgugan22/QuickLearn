const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  department: String,
  email: String,
  enrolledCourses: [String], // assuming it's an array of course IDs or names
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);