const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Student = require('../models/student');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: GET one student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) 
      return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/students', async (req, res) => {
  try {
    const { department, email, name, studentId } = req.body;

    // Validate required fields
    if (!studentId || !department || !email || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate studentId
    const existingStudent = await Student.findOne({ studentId });
    const existingUser = await User.findOne({ username: studentId });

    if (existingStudent || existingUser) {
      return res.status(409).json({ message: 'Student already exists' });
    }

    // Hash default password (only backend handles password!)
    const hashedPassword = await bcrypt.hash("Pass123", 10);

    // Create new Student (academic info only)
    const newStudent = new Student({
      department,
      email,
      name,
      studentId
    });

    // Create login credential in User model
    const newUser = new User({
      username: studentId,
      password: hashedPassword,
      role: 'student'
    });

    // Save both
    await newStudent.save();
    await newUser.save();

    res.status(201).json({ message: 'Student registered successfully' });

  } catch (e) {
    console.error('Registration Error:', e);
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});



// UPDATE a student
router.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;