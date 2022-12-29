const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const candidateSchema = new mongoose.Schema({
  candidate_name: String,
  position_applied: String,
  experience_level: String,
  contact_no: String,
  address: String,
  register_date: Date,
  last_update: Date,
  l1_feedback: {
    type: Object,
    required: false
  },
  l2_feedback: {
    type: Object,
    required: false,

  },
  hr_feedback: {
    type: Object,
    required: false,
  },
});
candidateSchema.plugin(mongoosePaginate);
const Candidate = mongoose.model('Candidate', candidateSchema);
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'itemsList',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
const options = {
  lean: true,
  limit: 10,
  page: 1,
  customLabels: myCustomLabels,
};

Candidate.paginate({}, options).then((err, result) => {
  console.log('result', result);
  return result;
});

module.exports = Candidate;
