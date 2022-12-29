/* eslint-disable no-console */
const Requirement = require('../models/requirement');
const configConst = require('../config/constant');
/**
 * GET /
 * Requirements page.
 */

exports.index = async (req, res) => {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);
  const limit = req.query.limit === undefined ? configConst.LIMIT : parseInt(req.query.limit, 10);
  const keyword = req.query.keyword !== undefined ? req.query.keyword : '';
  const regex = new RegExp(keyword, 'i');
  const skipIndex = (page - 1) * limit;
  const results = {};
  try {
    results.results = await Requirement.find({
      $or: [
        { position: regex },
        { job_location: regex },
        { department: regex },
        { project_name: regex },
        { job_description: regex },
      ]
    })
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured while fetching requirements list' });
  }
  const totalRecord = await Requirement.count({
    $or: [
      { position: regex },
      { job_location: regex },
      { department: regex },
      { project_name: regex },
      { job_description: regex },
    ]
  }).exec();
  const recordPerPage = configConst.LIMIT;
  const noOfPages = Math.ceil(totalRecord / recordPerPage);
  const currPageNo = req.query.page === (null || undefined) ? 1 : req.query.page;

  // get records to skip
  res.send(results);
  // get records to skip
  // res.render('requirements', {
  //   title: 'Requirements',
  //   result: results.results,
  //   active: { requirements: true },
  //   keyword,
  //   pagination: { page: currPageNo, pageCount: noOfPages },
  // });
};

/**
 * GET
 * requirement page
 */
exports.getAddRequirement = (req, res) => {
  res.render('addrequirement', {
    title: 'Add Requirement',
    active: { requirements: true },
    position: configConst.position,
    job_location: configConst.job_location,
    position_type: configConst.position_type,
  });
};

/**
 * POST
 * requirement page
 */
exports.postAddRequirement = (req, res, next) => {
  console.log('req', req.body);
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/requirements/add');
  }
  const requirement = new Requirement({
    position: req.body.position,
    job_location: req.body.job_location,
    department: req.body.department,
    experience_level: req.body.experience_level,
    position_type: req.body.position_type,
    project_name: req.body.project_name,
    job_description: req.body.job_description,
    register_date: new Date(),
    last_update: new Date(),
  });

  console.log('requirement', requirement);
  requirement.save((err) => {
    if (!err) {
      req.flash('success', { msg: 'Requirement added successfully!' });
    } else {
      return next(err);
    }
    res.redirect('/requirements');
  });
};

exports.getUpdateRequirement = async (req, res) => {
  let requirementData = '';
  try {
    requirementData = await Requirement.findById({ _id: req.params.id }).exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured' });
  }
  console.log('candidateData', requirementData);
  // res.render('addrequirement', {
  //   title: 'update Requirement',
  //   active: { requirements: true },
  //   requirement: requirementData,
  //   id: { requirement_id: req.params.id },
  //   setSelectedPosition: requirementData.position,
  //   setSelectedJobLocation: requirementData.job_location,
  //   setSelectedpositionType: requirementData.position_type,
  //   position: configConst.position,
  //   job_location: configConst.job_location,
  //   position_type: configConst.position_type,
  // });
  res.send(requirementData);
};

exports.postUpdateRequirement = async (req, res) => {
  try {
    const updateObj = {
      position: req.body.position,
      position_type: req.body.position_type,
      job_location: req.body.job_location,
      experience_level: req.body.experience_level,
      department: req.body.department,
      project_name: req.body.project_name,
      job_description: req.body.job_description,
      last_update: new Date(),
    };
    const id = req.body;
    await Requirement.findByIdAndUpdate(id,
      { $set: updateObj },
      { new: true },
      (err) => {
        if (err) {
          req.flash('errors', { msg: err });
        } else {
          //req.flash('success', { msg: 'Requirement updated successfully!!' });
          console.log("Requirement updated successfully!");
          res.redirect('/requirements');
        }
      });
  } catch (e) {
    //req.flash('error', { msg: 'Error Occured while updating!!' });
    console.log('Error Occured while updating!');
  }
};

/*
* delete candaite record
*/

exports.getDeleteRequirement = async (req, res) => {
  const requirementId = req.params.id;
  try {
    Requirement.deleteOne({ _id: requirementId }).exec();
    req.flash('success', { msg: 'Requirement deleted successfully!!' });
    res.redirect('/requirements');
  } catch (e) {
    req.flash('error', { msg: 'Error Occured while deleting!!' });
    res.redirect('/requirements');
  }
};

/**
 * view page for requirement
 */
exports.getViewRequirement = async (req, res) => {
  let requirementData = '';
  try {
    requirementData = await Requirement.findById({ _id: req.params.id }).exec();
  } catch (e) {
    req.flash('error', { msg: 'No record found!!' });
    res.redirect('/requirements');
    // res.status(500).json({ message: 'Error Occured' });
  }
  console.log('candidateData', requirementData);
  res.render('viewrequirement', {
    title: 'View Requirement',
    active: { requirements: true },
    requirement: requirementData,
    id: { requirement_id: req.params.id },
  });
};
// const paginatedResults = () => async (req, res, next) => {
//   const page = parseInt(req.query.page, 10);
//   const limit = parseInt(req.query.limit, 10);
//   const skipIndex = (page - 1) * limit;
//   const results = {};
//   try {
//     results.results = await Candidate.find()
//       .sort({ _id: 1 })
//       .limit(limit)
//       .skip(skipIndex)
//       .exec();
//     return results;
//   } catch (e) {
//     res.status(500).json({ message: 'Error Occured' });
//   }
// };
