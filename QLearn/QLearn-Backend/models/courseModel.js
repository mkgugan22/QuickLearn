const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const CourseSchema = new mongoose.Schema({
  courseName: String,
  courseDescription: String,
  courseCode: { type: String, unique: true },
  enrollPeriod: {
    startDate: Date,
    endDate: Date,
  },
  modules: [ModuleSchema],
  department: String,
  numberOfSeats: Number,
});

module.exports = mongoose.model('Course', CourseSchema);
