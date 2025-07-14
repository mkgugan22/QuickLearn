const Student = require('../models/studentModel');
const Course = require('../models/courseModel');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

const updateStudentById = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.studentId },
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
};


const enrollInCourse = async (req, res) => {
  try {
    const { studentId, courseCode } = req.params;
    const student = await Student.findOne({ studentId });
    const course = await Course.findOne({ courseCode });

    if (!student || !course) return res.status(404).json({ error: 'Student or Course not found' });

    const now = new Date();
    if (now < new Date(course.enrollPeriod.startDate) || now > new Date(course.enrollPeriod.endDate)) {
      return res.status(400).json({ error: 'Enrollment period closed' });
    }

    if (course.numberOfSeats <= 0) {
      return res.status(400).json({ error: 'No seats available' });
    }

    if (student.enrolledCourses.includes(courseCode)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    if (student.enrolledCourses.length >= 6) {
      return res.status(400).json({ error: 'Enrollment limit reached. You can enroll in a maximum of 6 courses.' });
    }

    student.enrolledCourses.push(courseCode);
    course.numberOfSeats -= 1;

    await student.save();
    await course.save();

    res.json({ enrolledCourses: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
};

// Unenroll student from course
const unenrollCourse = async (req, res) => {
  try {
    const { studentId, courseCode } = req.params;
    const student = await Student.findOne({ studentId });
    const course = await Course.findOne({ courseCode });

    if (!student || !course) return res.status(404).json({ error: 'Student or Course not found' });

    if (!student.enrolledCourses.includes(courseCode)) {
      return res.status(400).json({ error: 'Student is not enrolled in this course' });
    }

    student.enrolledCourses = student.enrolledCourses.filter(code => code !== courseCode);
    course.numberOfSeats += 1;

    await student.save();
    await course.save();

    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unenrollment failed' });
  }
};

// Get enrolled courses of student
const getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student.enrolledCourses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};

const notifyCourseDeletion = async (req, res) => {
  const { courseCode, courseName } = req.body;

  try {
    const students = await Student.find({ enrolledCourses: courseCode });

    const message = `The course "${courseName}" (code: ${courseCode}) has been removed by the admin.`;

    const bulkOps = students.map((student) => ({
      updateOne: {
        filter: { _id: student._id },
        update: {
          $pull: { enrolledCourses: courseCode },
          $push: {
            notifications: {
              message,
              date: new Date(),
              read: false,
            },
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await Student.bulkWrite(bulkOps);
    }

    res.json({ message: 'Students notified' });
  } catch (err) {
    console.error('Notify error:', err);
    res.status(500).json({ message: 'Error notifying students' });
  }
};

const notifyCourseCreation = async (req, res) => {
  const { courseCode, courseName } = req.body;

  if (!courseCode || !courseName) {
    return res.status(400).json({ message: 'Missing courseCode or courseName' });
  }

  try {
    const students = await Student.find();

    const message = `A new course "${courseName}" (code: ${courseCode}) has been added. Check it out!`;

    const bulkOps = students.map((student) => ({
      updateOne: {
        filter: { _id: student._id },
        update: {
          $push: {
            notifications: {
              message,
              date: new Date(),
              read: false,
            },
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await Student.bulkWrite(bulkOps);
    }

    res.json({ message: 'All students notified of new course' });
  } catch (err) {
    console.error('Notify error:', err);
    res.status(500).json({ message: 'Error notifying students' });
  }
};

// GET notifications for a specific student
const notifyCourse = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student.notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

const notifyCourseUpdate = async (req, res) => {
  const { courseCode, courseName } = req.body;

  try {
    const students = await Student.find({ enrolledCourses: courseCode });

    const message = `The course "${courseName}" (code: ${courseCode}) has been updated. Please review the changes.`;

    const bulkOps = students.map((student) => ({
      updateOne: {
        filter: { _id: student._id },
        update: {
          $push: {
            notifications: {
              message,
              date: new Date(),
              read: false,
            },
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await Student.bulkWrite(bulkOps);
    }

    res.json({ message: 'Enrolled students notified of update' });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ message: 'Error notifying students' });
  }
};


module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentById,
  enrollInCourse,
  unenrollCourse,
  getEnrolledCourses,
  notifyCourseDeletion,
  notifyCourse,
  notifyCourseCreation,
  notifyCourseUpdate
};