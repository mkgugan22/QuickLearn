
/* const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  instructor: String,
  material: String,
  category: String,
  duration: String,
  rating: Number,
  modules:String
});

module.exports = mongoose.model('Course', courseSchema);
 */


// models/allCourse.js (Mongoose schema)
const mongoose = require('mongoose');
const pdfMaterialSchema = new mongoose.Schema({
  originalName: String,         // lecture1.pdf
  pdfPath: String,              // /uploads/pdfs/<hashed>.pdf
  audioName: String,            // lecture1.mp3
  audioPath: String             // /uploads/audio/<hashed>.mp3
}, { _id: false });

const courseSchema = new mongoose.Schema({
  courseName: String,
  courseDescription: String,
  courseCode: String,
  enrollPeriod: {
    startDate: Date,
    endDate: Date
  },
  modules: [
    {
      title: String,
      description: String,
      youtubeLink: String,
    }
  ],
  department: String,
  numberOfSeats: Number,
  instructorId: String,
  instructorName: String,
  pdfMaterials: [pdfMaterialSchema] 
});
module.exports = mongoose.model('Course', courseSchema);