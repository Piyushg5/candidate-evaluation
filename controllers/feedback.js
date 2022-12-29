/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const Candidate = require('../models/candidate');
const technical_skills = require('../models/skills');
const configConst = require('../config/constant');
const Download = require('./download');

/**
 * GET /
 * Feedback list page.
 */
exports.index = async (req, res) => {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);
  const limit = req.query.limit === undefined ? configConst.LIMIT : parseInt(req.query.limit, 10);
  let keyword = req.query.keyword !== undefined ? req.query.keyword : '';
  const skipIndex = (page - 1) * limit;
  const results = {};
  const keywordObjCheck = keyword.toLowerCase();
  if (keywordObjCheck === 'next') {
    keyword = 1;
  }
  if (keywordObjCheck === 'hold') {
    keyword = 2;
  }
  if (keywordObjCheck === 'no go') {
    keyword = 0;
  }
  const regex = new RegExp(keyword, 'i');

  try {
    console.log("in feedback");
    results.results = await Candidate.find({
      $or: [
        { candidate_name: regex },
        { position_applied: regex },
        { 'l1_feedback.optradio': regex },
        { 'l2_feedback.optradio': regex },
        { 'hr_feedback.optradio': regex },
      ]
    })
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured' });
  }
  const totalRecord = await Candidate.count({
    $or: [
      { candidate_name: regex },
      { position_applied: regex },
      { 'l1_feedback.optradio': regex },
      { 'l2_feedback.optradio': regex },
      { 'hr_feedback.optradio': regex },
    ]
  }).exec();
  const recordPerPage = configConst.LIMIT;
  const noOfPages = Math.ceil(totalRecord / recordPerPage);
  const currPageNo = req.query.page === (null || undefined) ? 1 : req.query.page;
  console.log("total record");

  res.render('feedback', {
    title: 'Feedback',
    result: results.results,
    active: { feedback: true },
    keyword,
    pagination: { page: currPageNo, pageCount: noOfPages },
  });
};

/**
 * get rows for feedback form in case of update
 */

let currentCandidateId;
const getFeedbackSkillsRows = (feedbackData) => {
  let skillsDropdown = [];
  // eslint-disable-next-line no-console
  console.log(currentCandidateId.candidateId);
  const candidateData = Candidate.findById({ _id: currentCandidateId.candidateId }).exec();
  const position_of_candidate = candidateData.position_applied;
  console.log(position_of_candidate);
  skillsDropdown = technical_skills.findOne({ skill_name: position_of_candidate }).exec();
  console.log(skillsDropdown.sub_skill_name);
  const techSkillsData = (feedbackData !== undefined && feedbackData.skills !== undefined) && JSON.parse(feedbackData.skills);
  let skills = '';
  // let dropdown = skillsDropdown.map(key => {<option value = {`${key.sub_skill_name}`}>{`${key.sub_skill_name}`}</option>});

  if (techSkillsData) {
    for (let i = 0; i < techSkillsData.length; i++) {
      skills += '<div class="form-row">';
      skills += `<div class="form-group col-md-3"><label for="inputEmail4">Technical Skills</label><select class="form-control" aria-label="Default select example" id="inputEmail4" name="technical_skills[]">${dropdown}</select></div>`;
      skills += `<div class="form-group col-md-2"><label for="inputPassword4">Rating</label><select class="form-control" aria-label="Default select example" name="ratings[]"><option value="1" ${techSkillsData[i].ratings === '1' && 'selected'}>1</option><option value="2" ${techSkillsData[i].ratings === '2' && 'selected'}>2</option><option value="3" ${techSkillsData[i].ratings === '3' && 'selected'}>3</option><option value="4" ${techSkillsData[i].ratings === '4' && 'selected'}>4</option><option value="5" ${techSkillsData[i].ratings === '5' && 'selected'}>5</option></select></div>`;
      skills += `<div class="form-group col-md-2"><label for="inputPassword4">Weightage</label><input type="text" class="form-control" id="inputPassword4" name="weightage[]" value="${techSkillsData[i].weightage}" /></div>`;
      skills += `<div class="form-group col-md-3"><label for="inputPassword4">Interviewers comment</label><input type="text" class="form-control" id="inputPassword4" name="interviewer_comment[]" value="${techSkillsData[i].interviewer_comment}" /></div>`;
      if (i === 0) {
        skills += '<div class="input-group-btn" id="add_button"><button class="btn btn-success" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-minus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg></button></div>';
      } else {
        skills += '<div class="input-group-btn" id="removeRow"><button class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg></button></div>';
      }
      skills += '</div>';
    }
  }
  return skills;
};
/**
 * get rows for attribute feedback form in case of update
 */

const getFeedbackAttributeRows = (feedbackData) => {
  const attributeData = (feedbackData !== undefined && feedbackData.attribute !== undefined) && JSON.parse(feedbackData.attribute);
  let skills = '';
  if (attributeData) {
    for (let j = 0; j < attributeData.length; j++) {
      skills += `<div class="form-row ${j === 0 && 'pt-5'}">`;
      skills += `<div class="form-group col-md-3"><label for="inputEmail4">Other Attributes</label><input type="text" class="form-control" id="inputEmail4" name="other_attribute[]" value="${attributeData[j].other_attribute}" /></div>`;
      skills += `<div class="form-group col-md-2"><label for="inputPassword4">Rating</label><select class="form-control" aria-label="Default select example" name="other_ratings[]"><option value="1" ${attributeData[j].other_ratings === '1' && 'selected'}>1</option><option value="2" ${attributeData[j].other_ratings === '2' && 'selected'}>2</option><option value="3" ${attributeData[j].other_ratings === '3' && 'selected'}>3</option><option value="4" ${attributeData[j].other_ratings === '4' && 'selected'}>4</option><option value="5" ${attributeData[j].other_ratings === '5' && 'selected'}>5</option></select></div>`;
      skills += `<div class="form-group col-md-5"><label for="inputPassword4">Interviewers comment</label><input type="text" class="form-control" id="inputPassword4" name="other_interviewer_comment[]" value="${attributeData[j].other_interviewer_comment}" /></div>`;
      if (j === 0) {
        skills += '<div class="input-group-btn" id="add_attribute_button"><button class="btn btn-success" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-minus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg></button></div>';
      } else {
        skills += '<div class="input-group-btn" id="removeRow"><button class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg></button></div>';
      }
      skills += '</div>';
    }
  }
  return skills;
};

/**
 * get feedback form
 */

exports.getFeedback = async (req, res) => {
  const feedbackFrom = req.params.from;
  let feedbackData = {};
  let candidateData = '';
  let technicalSkills = '';
  try {
    // eslint-disable-next-line no-console
    const { candidateId } = req.params;
    currentCandidateId  = req.params;
    candidateData = await Candidate.findById({ _id: candidateId }).exec();
    const position_of_candidate = candidateData.position_applied;
    console.log(position_of_candidate);
    technicalSkills = await technical_skills.findOne({ skill_name: position_of_candidate }).exec();
  } catch (e) {
    req.flash('error', { msg: 'Error Occured while fetching record!!' });
    // res.redirect('/feedback');
  }
  if (feedbackFrom === 'l1') {
    feedbackData = candidateData.l1_feedback;
  }
  if (feedbackFrom === 'l2') {
    feedbackData = candidateData.l2_feedback;
  }
  if (feedbackFrom === 'hr') {
    feedbackData = candidateData.hr_feedback;
  }
  const feedbackSkillsRows = getFeedbackSkillsRows(feedbackData);
  const feedbackAttributeRows = getFeedbackAttributeRows(feedbackData);

  res.render('addfeedback', {
    title: 'Add Feedback',
    active: { feedback: true },
    candidate: candidateData,
    skills: (feedbackData !== undefined && feedbackData.skills !== undefined) && JSON.parse(feedbackData.skills),
    attribute: (feedbackData !== undefined && feedbackData.attribute !== undefined) && JSON.parse(feedbackData.attribute),
    write_something: feedbackData !== undefined ? feedbackData.write_something : '',
    optradio: feedbackData !== undefined && feedbackData.optradio,
    id: { candidate_id: req.params.candidateId },
    ratings: configConst.ratings,
    technical_skills: technicalSkills.sub_skill_name,
    feedbackFrom: feedbackFrom.toUpperCase(),
    feedbackRows: feedbackSkillsRows,
    feedbackAttributeRows,
    flash: req.flash('error', { msg: 'Error Occured while fetching record!!' })
  });
};

/**
 * post feedback form
 */

exports.postFeedback = async (req, res) => {
  const feedbackFrom = req.params.from;
  const { candidateId } = req.params;
  console.log(feedbackFrom, candidateId);
  // for (let i = 0; i < req.body.technical_skills.length; i++) {
  //   skills[i] = {
  //     technical_skills: req.body.technical_skills[i],
  //     ratings: req.body.ratings[i],
  //     weightage: req.body.weightage[i],
  //     interviewer_comment: req.body.interviewer_comment[i]
  //   };
  // }
  // for (let j = 0; j < req.body.other_attribute.length; j++) {
  //   attribute[j] = {
  //     other_attribute: req.body.other_attribute[j],
  //     other_ratings: req.body.other_ratings[j],
  //     other_interviewer_comment: req.body.other_interviewer_comment[j]
  //   };
  // }
  const feedbackData = {
    skills: JSON.stringify(req.body.skills),
    attribute: JSON.stringify(req.body.attribute),
    overallFeedback: req.body.overallFeedback,
    optradio: req.body.optRadio,
  };
  console.log(feedbackData);
  let updateObj = {};
  if (feedbackFrom === 'L1') {
    updateObj = {
      last_update: new Date(),
      l1_feedback: feedbackData
    };
  } else if (feedbackFrom === 'L2') {
    updateObj = {
      last_update: new Date(),
      l2_feedback: feedbackData
    };
  } else if (feedbackFrom === 'HR') {
    updateObj = {
      last_update: new Date(),
      hr_feedback: feedbackData
    };
  } else {
    res.redirect('/feedback');
  }
  try {
    Candidate.updateOne({ _id: candidateId }, {
      $set: updateObj
    }).exec();
    req.flash('success', { msg: 'Feedback updated successfully!!' });
    res.send("Success");
    res.redirect('/feedback');
  } catch (e) {
    req.flash('errors', { msg: e });
    res.redirect('/feedback');
  }
};

/**
 * download feedback
 */

exports.download = async (req, res) => {
  const { candidateId } = req.params;
  console.log('in download', candidateId);
  let candidateData = [];
  candidateData = await Candidate.findById({ _id: candidateId }).exec();
  const ig = new Download(candidateData, req, res);
  try {
    ig.generate();
  } catch (e) {
    console.log(e);
  }
};

/*
* search candidates
*/
exports.search = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);
  const skipIndex = (page - 1) * limit;
  const results = {};
  try {
    let { keyword } = req.body;
    const keywordObjCheck = keyword.toLowerCase();
    if (keywordObjCheck === 'next') {
      keyword = 1;
    }
    if (keywordObjCheck === 'hold') {
      keyword = 2;
    }
    if (keywordObjCheck === 'no go') {
      keyword = 0;
    }
    const regex = new RegExp(keyword, 'i');
    results.results = await Candidate.find({
      $or: [
        { candidate_name: regex },
        { position_applied: regex },
        { 'l1_feedback.optradio': regex },
        { 'l2_feedback.optradio': regex },
        { 'hr_feedback.optradio': regex },
      ]
    })
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (e) {
    console.log('e', e);
    req.flash('errors', { msg: e });
  }
  const recordPerPage = configConst.RECORD_PER_PAGE;
  const totalRecord = results.results.length;
  const noOfPages = Math.ceil(totalRecord / recordPerPage);
  const currPageNo = req.query.page === null ? 1 : req.query.page;
  // get records to skip
  const startFrom = (currPageNo - 1) * recordPerPage;
  res.render('feedback', {
    title: 'Feedback',
    result: results.results,
    active: { feedback: true },
    keyword: req.body.keyword,
    pagination: { pages: noOfPages, limit: 10, totalRows: 20 },
  });
};
