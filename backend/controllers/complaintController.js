const Complaint = require('../models/Complaint');

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Private
const addComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    if (!name || !email || !title || !description || !category || !location) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      name,
      email,
      title,
      description,
      category,
      location,
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { category, location } = req.query;
    let query = {};

    // Only allow users to see their own complaints, admins can see all
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    if (category) {
      query.category = category;
    }

    // Handled in a separate route or here via query param
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Admin mostly, or User updating their own if allowed)
const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    // Check for user ownership if not admin
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized to update this complaint');
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search
// @access  Private
const searchComplaints = async (req, res, next) => {
  try {
    const { location } = req.query;

    if (!location) {
      res.status(400);
      throw new Error('Please provide a location to search');
    }

    let query = { location: { $regex: location, $options: 'i' } };

    // Only allow users to see their own complaints, admins can see all
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  updateComplaint,
  searchComplaints
};
