const feedbackLabelColor = (jsonObj, level) => {
  if (level === 'l1' && jsonObj.l1_feedback === undefined) { // no feedback
    return 'bg-orange'; // orange
  }
  if (level === 'l1' && jsonObj.l1_feedback.optradio === '0') {
    return 'bg-danger'; // red
  }
  if (level === 'l1' && jsonObj.l1_feedback.optradio === '1') {
    return 'bg-success'; // green
  }
  if (level === 'l1' && jsonObj.l1_feedback.optradio === '2') {
    return 'bg-warning'; // yellow
  }
  if (level === 'l2' && jsonObj.l2_feedback === undefined) { // no feedback
    return 'bg-orange'; // orange
  }
  if (level === 'l2' && jsonObj.l2_feedback.optradio === '0') {
    return 'bg-danger'; // red
  }
  if (level === 'l2' && jsonObj.l2_feedback.optradio === '1') {
    return 'bg-success'; // green
  }
  if (level === 'l2' && jsonObj.l2_feedback.optradio === '2') {
    return 'bg-warning'; // yellow
  }
  if (level === 'hr' && jsonObj.hr_feedback === undefined) { // no feedback
    return 'bg-orange'; // orange
  }
  if (level === 'hr' && jsonObj.hr_feedback.optradio === '0') {
    return 'bg-danger'; // red
  }
  if (level === 'hr' && jsonObj.hr_feedback.optradio === '1') {
    return 'bg-success'; // green
  }
  if (level === 'hr' && jsonObj.hr_feedback.optradio === '2') {
    return 'bg-warning'; // yellow
  }
};

module.exports = feedbackLabelColor;
