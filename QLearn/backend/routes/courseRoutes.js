const express = require('express');
const axios = require('axios');
const router = express.Router();
const Course = require('../models/allCourse');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs/promises');
const fsSync = require('fs');
const pdfParse = require('pdf-parse');
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

 
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
 
    // Notify all students after course is successfully created
    try {
      await axios.post('http://localhost:3000/api/students/notify-creation', {
        courseCode: course.courseCode,
        courseName: course.courseName,
      });
    } catch (notifyErr) {
      console.error('Failed to notify student backend:', notifyErr.message);
      // Optional: you can still respond with success even if notification fails
    }
 
    res.status(201).send(course);
  } catch (err) {
    res.status(400).send(err);
  }
});
 
 
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

const ensureDirExists = (dirPath) => {
  if (!fsSync.existsSync(dirPath)) {
    fsSync.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirExists(path.join(__dirname, '..', 'uploads', 'pdfs'));
ensureDirExists(path.join(__dirname, '..', 'uploads', 'audio'));
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/pdfs'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));   // 123.pdf
  }
});
const pdfUpload = multer({
  storage,
  fileFilter: (_, file, cb) =>
    cb(null, file.mimetype === 'application/pdf')
});






router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.send(course);
});
 
router.put('/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
 
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
 
    // Notify enrolled students
    try {
      await axios.post('http://localhost:3000/api/students/notify-update', {
        courseCode: updatedCourse.courseCode,
        courseName: updatedCourse.courseName,
      });
    } catch (err) {
      console.error('Failed to notify students:', err.message);
    }
 
    res.json({ message: 'Course updated and students notified', updatedCourse });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
 
router.get('/course/enrollDate/:id',async(req,res)=>{
  const id = req.params.id;
  try{
    const course = await Course.findById(id);
    if(course && course.enrollPeriod){
      const courseEnrollDate = course.enrollPeriod.startDate
      const courseEnrollEnd = course.enrollPeriod.endDate
      console.log(courseEnrollDate);
      console.log(courseEnrollEnd)
        return res.status(200).json({
        courseEnrollDate,
        courseEnrollEnd
      });
    }
  }catch(err){
    console.log(err);
  }
})
router.get('/course/HighDurationCourses', async (req, res) => {
  try {
    const allCourses = await Course.find({});
 
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).send('No Courses found');
    }
 
    let maxDuration = 0;
    let longestCourses = [];
 
    allCourses.forEach(course => {
      if (course && course.enrollPeriod) {
        const startDate = course.enrollPeriod.startDate;
        const endDate = course.enrollPeriod.endDate;
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
 
        if (duration > maxDuration) {
          maxDuration = duration;
          longestCourses = [course];
        } else if (duration === maxDuration) {
          longestCourses.push(course);
        }
      }
    });
     console.log(maxDuration+" "+longestCourses)
    return res.status(200).json({
      maxDurationInDays: maxDuration,
      longestCourses
    });
 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
 
 
// router.get('/course/MaximumSeatsAvailable', async (req,res)=>{
//   try{
//     const totalcourses = await Course.find({})
//     if(!totalcourses ||  totalcourses.length<=0){
//       res.status(404).send('No course are found')
//     }
 
//     let maxSeats = 0;
//     let maxSeatsAvailableCourses =[]
 
//     totalcourses.forEach(courses =>{
//       if(courses&& courses.numberOfSeats){
//         const seats = courses.numberOfSeats
//         maxSeats= Math.max(maxSeats,seats)
//         maxSeatsAvailableCourses = [courses]
//       }
 
//     })
//     res.status(200).json({
//       maxSeatsAvailableCourses,
//       maxSeats
//     })
//     console.log(maxSeats)
//     console.log(maxSeatsAvailableCourses)
//   }catch(err){
//     console.log(err);
//   }
 
// })
 
 
router.get('/course/MaximumSeatsAvailable', async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses || courses.length === 0) {
      return res.status(404).send('No courses found');
    }
 
    let maxSeats = Math.max(...courses.map(c => c.numberOfSeats || 0));
    const maxSeatsAvailableCourses = courses.filter(c => c.numberOfSeats === maxSeats);
 
    res.status(200).json({
      maxSeats,
      maxSeatsAvailableCourses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
 
// router.get('/course/MinimumSeatsAvailable', async (req,res)=>{
//   try{
//     const totalcourses = await Course.find({})
//     if(!totalcourses ||  totalcourses.length<=0){
//       res.status(404).send('No course are found')
//     }
 
//     let minSeats = Number.MAX_VALUE;
//     let minSeatsAvailableCourses =[]
 
//     totalcourses.forEach(courses =>{
//       if(courses&& courses.numberOfSeats){
//         const seats = courses.numberOfSeats
//         minSeats= Math.min(minSeats,seats)
//         minSeatsAvailableCourses = [courses]
//       }
 
//     })
//     res.status(200).json({
//       minSeatsAvailableCourses,
//       minSeats
//     })
//     console.log(minSeats)
//     console.log(minSeatsAvailableCourses)
//   }catch(err){
//     console.log(err);
//   }
 
// })
 
 
router.get('/course/MinimumSeatsAvailable', async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses || courses.length === 0) {
      return res.status(404).send('No courses found');
    }
 
    let minSeats = Math.min(...courses.map(c => c.numberOfSeats || 0));
    const minSeatsAvailableCourses = courses.filter(c => c.numberOfSeats === minSeats);
 
    res.status(200).json({
      minSeats,
      minSeatsAvailableCourses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
 
router.get('/course/LargeModules', async(req,res)=>{
  try{
    const AllCoursesAvailable  = await Course.find({})
    // const module =  AllCoursesAvailable.module
    if(!AllCoursesAvailable || AllCoursesAvailable.length<=0){
      res.status(404)
.send('No Courses available')  
 }
 let maxModuleLength = 0
 let longCourses = []
     AllCoursesAvailable.forEach(course => {
      const moduleCount = course.modules?.length || 0;
      if (moduleCount > maxModuleLength) {
        maxModuleLength = moduleCount;
      }
    });
 
    // Second pass: Collect all courses with max module count
    AllCoursesAvailable.forEach(course => {
      const moduleCount = course.modules?.length || 0;
      if (moduleCount === maxModuleLength) {
        longCourses.push(course);
      }
    });
    res.status(200).json({
      maxModuleLength,
      longCourses
    })
    console.log(maxModuleLength+" "+longCourses)
  }catch(err){
    res.status(404).send(err)
    console.log(err)
  }
})
 
 
router.delete('/code/:courseCode', async (req, res) => {
  const courseCode = req.params.courseCode;
 
  try {
    const deletedCourse = await Course.findOneAndDelete({ courseCode });
 
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
 
    // Notify students
    try {
      await axios.post('http://localhost:3000/api/students/notify-deletion', {
        courseCode,
        courseName: deletedCourse.courseName,
      });
    } catch (err) {
      console.error('Failed to notify student backend:', err.message);
    }
 
    res.json({ message: 'Course deleted and notification sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 

// Language configuration for multi-language support
const supportedLanguages = {
  'en-US': { name: 'English', ssmlGender: 'NEUTRAL' },
  'hi-IN': { name: 'Hindi', ssmlGender: 'NEUTRAL' },
  'ta-IN': { name: 'Tamil', ssmlGender: 'NEUTRAL' },
  'te-IN': { name: 'Telugu', ssmlGender: 'NEUTRAL' },
  'mr-IN': { name: 'Marathi', ssmlGender: 'NEUTRAL' },
  'bn-IN': { name: 'Bengali', ssmlGender: 'NEUTRAL' },
  'gu-IN': { name: 'Gujarati', ssmlGender: 'NEUTRAL' },
  'kn-IN': { name: 'Kannada', ssmlGender: 'NEUTRAL' },
  'ml-IN': { name: 'Malayalam', ssmlGender: 'NEUTRAL' },
  'pa-IN': { name: 'Punjabi', ssmlGender: 'NEUTRAL' },
  'ur-IN': { name: 'Urdu', ssmlGender: 'NEUTRAL' },
  'es-ES': { name: 'Spanish', ssmlGender: 'NEUTRAL' },
  'fr-FR': { name: 'French', ssmlGender: 'NEUTRAL' },
  'de-DE': { name: 'German', ssmlGender: 'NEUTRAL' },
  'it-IT': { name: 'Italian', ssmlGender: 'NEUTRAL' },
  'ja-JP': { name: 'Japanese', ssmlGender: 'NEUTRAL' },
  'ko-KR': { name: 'Korean', ssmlGender: 'NEUTRAL' },
  'pt-BR': { name: 'Portuguese', ssmlGender: 'NEUTRAL' },
  'ru-RU': { name: 'Russian', ssmlGender: 'NEUTRAL' },
  'ar-SA': { name: 'Arabic', ssmlGender: 'NEUTRAL' },
  'zh-CN': { name: 'Chinese (Simplified)', ssmlGender: 'NEUTRAL' }
};

// Get supported languages endpoint
router.get('/supported-languages', (req, res) => {
  res.json(supportedLanguages);
});

// Enhanced material upload with multi-language support
router.post('/:courseId/material', pdfUpload.single('pdf'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { languages = ['en-US'] } = req.body; // Default to English if no languages specified
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const dataBuffer = await fs.readFile(req.file.path);
    const { text } = await pdfParse(dataBuffer);

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: 'PDF has no readable text' });
    }

    // Generate audio for each requested language
    const audioFiles = [];
    const languageArray = typeof languages === 'string' ? [languages] : languages;
    
    for (const languageCode of languageArray) {
      if (!supportedLanguages[languageCode]) {
        console.warn(`Unsupported language: ${languageCode}`);
        continue;
      }

      try {
        const [response] = await client.synthesizeSpeech({
          input: { text: text.slice(0, 4500) },
          voice: { 
            languageCode: languageCode, 
            ssmlGender: supportedLanguages[languageCode].ssmlGender 
          },
          audioConfig: { audioEncoding: 'MP3' }
        });

        const audioName = `${path.basename(req.file.filename, '.pdf')}_${languageCode}.mp3`;
        const audioPath = path.join('uploads/audio', audioName);
        await fs.writeFile(audioPath, response.audioContent, 'binary');

        audioFiles.push({
          languageCode,
          languageName: supportedLanguages[languageCode].name,
          audioName,
          audioPath: '/' + audioPath
        });
      } catch (audioErr) {
        console.error(`Failed to generate audio for ${languageCode}:`, audioErr);
      }
    }

    // Create material object with multi-language audio
    const material = {
      originalName: req.file.originalname,
      pdfPath: '/' + req.file.path,
      audioFiles,
      uploadDate: new Date(),
      extractedText: text.slice(0, 1000) // Store first 1000 chars for preview
    };

    course.pdfMaterials.push(material);
    await course.save();
    
    res.status(201).json({ 
      msg: 'Material uploaded with multi-language audio', 
      pdfMaterials: course.pdfMaterials,
      generatedLanguages: audioFiles.map(af => af.languageName)
    });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Delete material endpoint
router.delete('/:courseId/material/:materialIndex', async (req, res) => {
  try {
    const { courseId, materialIndex } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    const materialIdx = parseInt(materialIndex);
    if (materialIdx < 0 || materialIdx >= course.pdfMaterials.length) {
      return res.status(400).json({ msg: 'Invalid material index' });
    }

    const material = course.pdfMaterials[materialIdx];
    
    // Delete PDF file
    try {
      await fs.unlink(material.pdfPath.substring(1)); // Remove leading '/'
    } catch (err) {
      console.warn('Failed to delete PDF file:', err);
    }

    // Delete audio files
    if (material.audioFiles) {
      for (const audioFile of material.audioFiles) {
        try {
          await fs.unlink(audioFile.audioPath.substring(1)); // Remove leading '/'
        } catch (err) {
          console.warn('Failed to delete audio file:', err);
        }
      }
    }

    // Remove from array
    course.pdfMaterials.splice(materialIdx, 1);
    await course.save();
    
    res.json({ msg: 'Material deleted successfully', pdfMaterials: course.pdfMaterials });
  } catch (err) {
    console.error('❌ Delete failed:', err);
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

// Get material details endpoint
router.get('/:courseId/material/:materialIndex', async (req, res) => {
  try {
    const { courseId, materialIndex } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    
    const materialIdx = parseInt(materialIndex);
    if (materialIdx < 0 || materialIdx >= course.pdfMaterials.length) {
      return res.status(400).json({ msg: 'Invalid material index' });
    }

    const material = course.pdfMaterials[materialIdx];
    res.json(material);
  } catch (err) {
    console.error('❌ Get material failed:', err);
    res.status(500).json({ error: 'Get material failed', details: err.message });
  }
});

module.exports = router;