const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approved: Boolean,
  rating: Number,
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('allCourse', courseSchema);

