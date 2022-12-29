/**
 * constant config for application
 */

module.exports = {
  LIMIT: 5,
  position_applied: {
    Java: 'Java', node_js: 'Node JS', react_js: 'React JS', magento: 'Magento', angular_js: 'Angular JS'
  },
  position: {
    tech_lead: 'Tech Lead', manager: 'Manager', sr_associate: 'Sr. Associate', associate: 'Associate'
  },
  job_location: {
    mumbai: 'Mumbai', pune: 'Pune', bengaluru: 'Bengaluru'
  },
  position_type: {
    full_time: 'Full Time', contract: 'Contract'
  },
  approval: ['No', 'Yes', 'Hold'],
  ratings: {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5
  },
  feebackStatus: {
    0: 'No Go', 1: 'Next Round', 2: 'On Hold'
  },
};
