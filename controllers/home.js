/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  console.log('req.session', req.session.userInfo);
  if (req.session.userInfo !== undefined && Object.keys(req.session.userInfo).length !== 0) {
    res.redirect('/candidates');
  }
  res.render('home', {
    title: 'Home'
  });
};
