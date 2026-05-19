const express = require('express');
const router = express.Router();
const {
  addComplaint,
  getComplaints,
  updateComplaint,
  searchComplaints
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getComplaints)
  .post(protect, addComplaint);

router.route('/search')
  .get(protect, searchComplaints);

router.route('/:id')
  .put(protect, updateComplaint);

module.exports = router;
