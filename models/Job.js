const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  storeName: { type: String, required: true },
  locationName: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  shiftTiming: { type: String, required: true },
  hourlyPay: { type: Number, required: true },
  matchPercentage: { type: Number, default: 85 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);