/* eslint-disable no-console */
const Candidate = require('../models/candidate');
const configConst = require('../config/constant');
// eslint-disable-next-line camelcase
const technical_skills = require('./skills');

/**
 * GET /
 * Candidate page.
 */
exports.index = async (req, res) => {
  let results = {};
  try {
    results = await Candidate.find();
    console.log(results);
    res.send(results);
     //{
    //   $or: [
    //     { candidate_name: regex },
    //     { address: regex },
    //     { contact_no: regex },
    //   ]
    // })
    //   .sort({ _id: 1 })
    //   .limit(limit)
    //   .skip(skipIndex)
    //   .exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured' });
  }
  // const totalRecord = await Candidate.count({
  //   $or: [
  //     { candidate_name: regex },
  //     { address: regex },
  //     { contact_no: regex },
  //   ]
  // }).exec();
  // const recordPerPage = configConst.LIMIT;
  // const noOfPages = Math.ceil(totalRecord / recordPerPage);
  // const currPageNo = req.query.page === (null || undefined) ? 1 : req.query.page;
  // console.log(results);
  // res.render('candidates', {
  //   title: 'Candidates',
  //   result: results.results,
  //   active: { candidate: true },
  //   keyword,
  //   pagination: { page: currPageNo, pageCount: noOfPages }
  // });
};

/**
 * GET
 * candidate page
 */
exports.getAddCandidate = async (req, res) => {
  const position = await technical_skills.getTechnicalSkills();
  // eslint-disable-next-line camelcase
  const position_list = position.map((a) => a.skill_name);
  // res.render('addcandidate', {
  //   title: 'Add Candidate',
  //   active: { candidate: true },
  //   position_applied: position_list,
  // });
  res.send(position_list);
  console.log(position_list);
};

/**
 * POST
 * candidate page
 */
exports.postAddCandidate = (req, res, next) => {
  console.log('req postcandidate', req.body);
  const validationErrors = [];
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/candidates/add');
  }
  const candidate = new Candidate({
    candidate_name: req.body.candidate_name,
    position_applied: req.body.position_applied,
    experience_level: req.body.experience_level,
    contact_no: req.body.contact_no,
    address: req.body.address,
    l1_feedback: { optradio: '' },
    l2_feedback: { optradio: '' },
    hr_feedback: { optradio: '' },
    register_date: new Date(),
    last_update: new Date()
  });

  candidate.save((err) => {
    if (!err) {
      req.flash('success', { msg: 'Candidate added successfully!' });
    } else {
      return next(err);
    }
    res.redirect('/candidates');
  });
};

exports.getUpdateCandidate = async (req, res) => {
  //const position = await technical_skills.getTechnicalSkills();
  // eslint-disable-next-line camelcase
  //const position_list = position.map((a) => a.skill_name);
  let candidateData = '';
  try {
    candidateData = await Candidate.findById({ _id: req.params.id }).exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured' });
  }
  // res.render('addcandidate', {
  //   title: 'Add Candidate',
  //   active: { candidate: true },
  //   candidate: candidateData,
  //   id: { candidate_id: req.params.id },
  //   position_applied: position_list,
  //   setSelected: candidateData.position_applied
  // });
  res.send(candidateData);
};

exports.postUpdateCandidate = async (req, res) => {
  try {
    const updateObj = {
      candidate_name: req.body.candidate_name,
      position_applied: req.body.position_applied,
      experience_level: req.body.experience_level,
      contact_no: req.body.contact_no,
      address: req.body.address,
      last_update: new Date()
    };
    console.log(updateObj);
    const id = req.params.id;
    console.log(req.params.id);
    await Candidate.findByIdAndUpdate(id,
      { $set: updateObj },
      { new: true },
      (err) => {
        if (err) {
          //req.flash('errors', { msg: err });
          console.log(err);
        } else {
          //req.flash('success', { msg: 'Candidate updated successfully!!' });
          console.log("Candidate updated successfully!");
          res.redirect('/candidates');
        }
      });
  } catch (e) {
    //req.flash('error', { msg: 'Error Occured while updating!!' });
    cosole.log("Error Occured while updating!");
  }
};

/*
* delete candaite record
*/

exports.getDeleteCandidate = async (req, res) => {
  const condidateId = req.params.id;
  try {
    Candidate.deleteOne({ _id: condidateId }).exec();
    req.flash('success', { msg: 'Candidate deleted successfully!!' });
    res.redirect('/candidates');
  } catch (e) {
    req.flash('error', { msg: 'Error Occured while deleting!!' });
    res.redirect('/candidates');
  }
};
