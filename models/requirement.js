const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  position: String,
  job_location: String,
  department: String,
  experience_level: String,
  position_type: String,
  project_name: String,
  job_description: String,
  register_date: Date,
  last_update: Date,
  approval: {
    type: String,
    default: 0 // 0->No, 1->Yes, 2-> Hold
  }
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
