const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

// POST /api/instructors
router.post('/', async (req, res) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json({ message: 'Instructor saved successfully', data: instructor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save instructor', error });
  }
});

// PUT /api/instructors/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInstructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json({ message: 'Instructor updated successfully', data: updatedInstructor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update instructor', error });
  }
});

// DELETE instructor by ID
// DELETE by custom instructorId
router.delete('/:instructorId', async (req, res) => {
  try {
    const result = await Instructor.findOneAndDelete({ instructorId: req.params.instructorId });
    if (!result) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
});


// GET /api/instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch instructors', error });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch instructor', error });
  }
});

module.exports = router;