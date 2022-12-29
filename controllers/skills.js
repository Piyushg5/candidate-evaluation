/* eslint-disable no-console */
/* eslint-disable camelcase */
// const configConst = require('../config/constant');
// eslint-disable-next-line camelcase
const Technical_Skills = require('../models/skills');
const configConst = require('../config/constant');

exports.getTechnicalSkills = async (req, res) => {
  let technical_skill = '';
  try {
    technical_skill = await Technical_Skills.find();
    console.log(technical_skill);
    res.send(technical_skill);
    return (technical_skill);
  } catch (e) {
    // req.flash('error', { msg: 'Error Occured while fetching records!!' });
    console.log('error in get tech skills');
  }
};

exports.index = async (req, res) => {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);
  const limit = req.query.limit === undefined ? configConst.LIMIT : parseInt(req.query.limit, 10);
  const keyword = req.query.keyword !== undefined ? req.query.keyword : '';
  const regex = new RegExp(keyword, 'i');
  const skipIndex = (page - 1) * limit;
  const results = {};
  try {
    results.results = await Technical_Skills.find({
      $or: [
        { skill_name: regex },
        { sub_skill_name: regex },
      ]
    })
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (e) {
    res.status(500).json({ message: 'Error Occured while fetching skills list' });
  }
  const totalRecord = await Technical_Skills.count({
    $or: [
      { skill_name: regex },
      { sub_skill_name: regex },
    ]
  }).exec();
  const recordPerPage = configConst.LIMIT;
  const noOfPages = Math.ceil(totalRecord / recordPerPage);
  const currPageNo = req.query.page === (null || undefined) ? 1 : req.query.page;
  // get records to skip
  res.render('skills', {
    title: 'Skills',
    result: results.results,
    active: { skills: true },
    keyword,
    pagination: { page: currPageNo, pageCount: noOfPages },
  });
};

/**
 * GET
 * skill page
 */
exports.getSkillbyId = (req, res) => {
  Technical_Skills.findById({ _id: req.params.id }).then((response) => {
    res.send(response);
  });
};

exports.getAddSkill = (req, res) => {
  res.render('addskill', {
    title: 'Add Skill',
    active: { skills: true },
  });
};

exports.postAddSkills = (req, res, next) => {
  console.log('req', req.body);
  const validationErrors = [];
  if (req.body.skill_name === '') {
    validationErrors.push({ msg: 'Please enter Skill.' });
  }
  if (req.body.sub_skill_name === '') {
    validationErrors.push({ msg: 'Please enter subskill' });
  }
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/getSkills/add');
  }
  const technical_Skills = new Technical_Skills({
    skill_name: req.body.skill_name,
    sub_skill_name: req.body.sub_skill_name,
  });

  console.log('skills', technical_Skills);
  technical_Skills.save((err) => {
    if (!err) {
      req.flash('success', { msg: 'Skills added successfully!' });
      res.send(`Success${technical_Skills}`);
    } else {
      return next(err);
    }
  });
};

exports.getSkillbyName = async (req, res) => {
  console.log('ji', req.body.skill_name);
  const skill_name = req.body.skill_name;
  const subSkills = await Technical_Skills.findOne({ skill_name: skill_name }).exec();
  console.log(subSkills);
  res.send(subSkills);
};

exports.getDeleteSkill = async (req, res) => {
  const skillId = req.params.id;
  try {
    Technical_Skills.deleteOne({ _id: skillId }).exec();
    req.flash('success', { msg: 'Skill deleted successfully!!' });
    res.send('success');
  } catch (e) {
    req.flash('error', { msg: 'Error Occured while deleting!!' });
    res.redirect('/skills');
  }
};
exports.postUpdateSkill = async (req, res) => {
  try {
    const updateObj = {
      skill_name: req.body.skill_name,
      sub_skill_name: req.body.sub_skill_name
    };
    console.log(updateObj);
    // eslint-disable-next-line prefer-destructuring
    const id = req.params.id;
    await Technical_Skills.findByIdAndUpdate(id,
      { skill_name: updateObj.skill_name, sub_skill_name: updateObj.sub_skill_name },
      (err, docs) => {
        if (err) {
          req.flash('errors', { msg: err });
        } else {
          console.log(docs);
          res.redirect('/skills');
        }
      });
  } catch (e) {
    req.flash('error', { msg: 'Error Occured while updating!!' });
  }
};