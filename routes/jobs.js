const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

// Get jobs filtered by distance radius
router.get('/', async (req, res) => {
  try {
    const maxRadius = parseFloat(req.query.radius) || 5;
    const jobs = await Job.find({ distanceKm: { $lte: maxRadius } }).sort({ distanceKm: 1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving jobs' });
  }
});

// Apply for a job opening
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job shift not found' });

    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already applied for this shift' });
    }

    job.applicants.push(req.user.id);
    await job.save();

    // Broadcast real-time application update via Socket.io
    const io = req.app.get('io');
    io.emit('job_updated', { jobId: job._id, applicantCount: job.applicants.length });

    res.json({ message: 'Application submitted successfully', job });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting application' });
  }
});

module.exports = router;