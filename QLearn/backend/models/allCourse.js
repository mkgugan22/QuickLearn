
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
const audioFileSchema = new mongoose.Schema({
  languageCode: String,         // en-US, hi-IN, ta-IN, etc.
  languageName: String,         // English, Hindi, Tamil, etc.
  audioName: String,            // lecture1_en-US.mp3
  audioPath: String             // /uploads/audio/<hashed>_en-US.mp3
}, { _id: false });

const pdfMaterialSchema = new mongoose.Schema({
  originalName: String,         // lecture1.pdf
  pdfPath: String,              // /uploads/pdfs/<hashed>.pdf
  audioFiles: [audioFileSchema], // Array of audio files in different languages
  uploadDate: { type: Date, default: Date.now },
  extractedText: String         // First 1000 chars of PDF text for preview
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