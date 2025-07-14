const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/:studentId/enroll/:courseCode', studentController.enrollInCourse);
router.post('/notify-creation', studentController.notifyCourseCreation);
router.post('/notify-deletion', studentController.notifyCourseDeletion);
router.post('/notify-update', studentController.notifyCourseUpdate);
router.get('/', studentController.getAllStudents);
router.get('/:studentId/notifications',studentController.notifyCourse);

// Specific routes first
router.get('/:studentId/enrolled-courses', studentController.getEnrolledCourses);
router.get('/:studentId', studentController.getStudentById);

router.put('/:studentId', studentController.updateStudentById);
router.delete('/:studentId/unenroll/:courseCode', studentController.unenrollCourse);


module.exports = router;
