const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: String,
  department: String,
  email: String,
  enrolledCourses: [String],
  notifications: [notificationSchema]
});

module.exports = mongoose.model('Student', StudentSchema);
