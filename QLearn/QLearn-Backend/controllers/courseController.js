const Course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.getCourseByCode = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.code });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getModulesByCourseCode = async (req, res) => {
  const course = await Course.findOne({ courseCode: req.params.code });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course.modules);
};

// GET /api/courses?page=1&limit=10&search=gokul&department=Science
exports.getPaginatedCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search?.toLowerCase() || '';
  const department = req.query.department;
  const status = req.query.status; // open | upcoming | closed

  const query = {};

  if (search && department && department !== 'All') {
    query.$and = [
      {
        $or: [
          { courseName: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      },
      { department }
    ];
  } else if (search) {
    query.$or = [
      { courseName: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ];
  } else if (department && department !== 'All') {
    query.department = department;
  }

  const today = new Date();

  // 🔄 Filter by enrollment status
  if (status === 'open') {
    query['enrollPeriod.startDate'] = { $lte: today };
    query['enrollPeriod.endDate'] = { $gte: today };
  } else if (status === 'upcoming') {
    query['enrollPeriod.startDate'] = { $gt: today };
  } else if (status === 'closed') {
    query['enrollPeriod.endDate'] = { $lt: today };
  }

  try {
    const courses = await Course.find(query).skip(skip).limit(limit);
    const total = await Course.countDocuments(query);

    res.json({
      courses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching paginated courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


