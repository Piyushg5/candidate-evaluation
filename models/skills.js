/* eslint-disable camelcase */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const techincalSkillSchema = new mongoose.Schema({
  skill_name: {
    type: String
  },
  sub_skill_name: [{
    type: String
  }]
});
techincalSkillSchema.plugin(mongoosePaginate);
const technical_skills = mongoose.model('technicalSkills', techincalSkillSchema);

module.exports = technical_skills;
