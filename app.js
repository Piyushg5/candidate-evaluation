/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const sass = require('node-sass-middleware');
const hbs = require('express-handlebars');
// const paginateHelper = require('express-handlebars-paginate');
const handlebars = require('handlebars');
const handlebarsIntl = require('handlebars-intl');
const handlebarsPaginate = require('handlebars-paginate');
const configConst = require('./config/constant');
const feedbackLabelColor = require('./views/helpers/feedbackLabelColor');
const cors = require("cors");


handlebarsIntl.registerWith(handlebars); // handlebars formatting
handlebars.registerHelper('paginate', handlebarsPaginate); // paging
// const addMoreFields = require('./views/helpers/addMoreFields');

// hbs.registerHelper('paginateHelper', paginateHelper.createPagination);

/**
  * Load environment variables from .env file, where API keys and passwords are configured.
  */
dotenv.config({ path: '.env' });

/**
  * Controllers (route handlers).
  */
const homeController = require('./controllers/home');
const candidateController = require('./controllers/candidates');
const requirementsController = require('./controllers/requirements');
const feedbackController = require('./controllers/feedback');
const userController = require('./controllers/user');
const skillsController = require('./controllers/skills')
/**
  * Create Express server.
  */
const app = express();

/**
  * Connect to MongoDB.
  */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
  * Express configuration.
  */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: path.join(__dirname, '/views/layouts/'),
  partialsDir: path.join(__dirname, '/views/partials/'),
  helpers: {
    // candidate
    name: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.candidate_name; } }),
    // eslint-disable-next-line max-len
    position_applied: ((jsonObj) => { if (jsonObj !== undefined) { return configConst.position_applied[jsonObj.position_applied]; } }),
    // eslint-disable-next-line max-len
    experience_level: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.experience_level; } }),
    contact_no: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.contact_no; } }),
    address: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.address; } }),
    id: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj._id; } }),
    dis_id: ((id) => id),
    // requirements
    position: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.position; } }),
    job_location: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.job_location; } }),
    department: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.department; } }),
    position_type: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.position_type; } }),
    project_name: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.project_name; } }),
    // eslint-disable-next-line max-len
    job_description: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.job_description; } }),
    isSelected: ((Country, key) => { if (Country === key) { return 'selected'; } }),
    approval: ((jsonObj) => configConst.approval[jsonObj.approval]),
    // skills
    skill_name: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.skill_name; } }),
    sub_skill_name: ((jsonObj) => { if (jsonObj !== undefined) { return jsonObj.sub_skill_name; } }),
    // feedback
    // eslint-disable-next-line max-len
    level_status: ((jsonObj, level) => { if (jsonObj[level] !== undefined) { if (jsonObj[level].optradio === '2') { return 'Hold'; } if (jsonObj[level].optradio === '1') { return 'Next'; } if (jsonObj[level].optradio === '0') { return 'No Go'; } } }),
    // eslint-disable-next-line max-len
    level_status_value: ((jsonObj, level, btnText, nextLevel) => { if (jsonObj[level] !== undefined && jsonObj[level].optradio === '1') { if (jsonObj[nextLevel] === undefined) { return `<a href="/feedback/${btnText}/${jsonObj._id}" type="button" class="btn text-white btn-sm rounded-0 a-btn-slide-text bg-orange "}">${btnText.toUpperCase()}</a>`; } if (jsonObj[nextLevel].optradio === '0') { return `<a href="/feedback/${btnText}/${jsonObj._id}" type="button" class="btn btn-sm text-white rounded-0 a-btn-slide-text bg-danger"}">${btnText.toUpperCase()}</a>`; } if (jsonObj[nextLevel].optradio === '1') { return `<a href="/feedback/${btnText}/${jsonObj._id}" type="button" class="btn text-white btn-sm rounded-0 a-btn-slide-text bg-success"}">${btnText.toUpperCase()}</a>`; } if (jsonObj[nextLevel].optradio === '2') { return `<a href="/feedback/${btnText}/${jsonObj._id}" type="button" class="btn text-white btn-sm rounded-0 a-btn-slide-text bg-warning">${btnText.toUpperCase()}</a>`; } } }),
    // feedback
    // eslint-disable-next-line max-len
    skills: ((arr, index, key) => { if (arr !== false) { return arr[index][key]; } }),
    attributes: ((arr, index, key) => { if (arr !== false) { return arr[index][key]; } }),
    isRadioSelected: ((value, key) => { if (parseInt(value, 10) === key) { return 'checked'; } }),
    message: ((msgObj) => msgObj.msg),
    feedbackLabelColor,
    // eslint-disable-next-line max-len
    greaterThan: ((v1, v2, options) => { if (v1 > v2) { return options.fn(this); } return options.inverse(this); }),
    addMoreFields: (() => {
      const arr = [0];
      arr.push(arr.length);
      console.log('add more fileds', arr);
      return arr;
    }),
  }
}));
app.use(cors());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(flash());
// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//     next();
//   }
// });
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  if (req.session.userInfo !== undefined && req.session.userInfo.account !== undefined) {
    res.locals.user = req.session.userInfo.account;
  }
  res.locals.base_url = process.env.BASE_URL;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  console.log('req', req.path);
  if (!req.user
     && req.path !== '/login'
     && req.path !== '/signup'
     && !req.path.match(/^\/auth/)
     && !req.path.match(/\./)) {
    req.session.returnTo = '/candidates';
  } else if (req.user
     && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = '/candidates';
  }
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));
 
/**
  * Primary app routes.
  */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.get('/redirect', userController.redirect);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/candidates', candidateController.index);
app.get('/candidates/add', candidateController.getAddCandidate);
app.get('/candidate/update/:id', candidateController.getUpdateCandidate);
app.get('/candidate/delete/:id', candidateController.getDeleteCandidate);
app.post('/candidate/update/:id', candidateController.postUpdateCandidate);
app.post('/candidates/add', candidateController.postAddCandidate);

app.get('/requirements', requirementsController.index);
app.get('/requirements/add', requirementsController.getAddRequirement);
app.post('/requirements/add', requirementsController.postAddRequirement);
app.get('/requirement/update/:id', requirementsController.getUpdateRequirement);
app.post('/requirement/update/:id', requirementsController.postUpdateRequirement);
app.get('/requirement/view/:id', requirementsController.getViewRequirement);
app.get('/requirement/delete/:id', requirementsController.getDeleteRequirement);

app.get('/feedback', feedbackController.index);
app.post('/feedback', feedbackController.search);
app.get('/feedback/download/:from/:candidateId', feedbackController.download);
app.get('/feedback/:from/:candidateId', feedbackController.getFeedback);
app.post('/feedback/:from/:candidateId', feedbackController.postFeedback);

app.get('/skills', skillsController.index);
app.get('/skills/add', skillsController.getAddSkill);
app.post('/skills/add', skillsController.postAddSkills);
app.post('/skills/update/:id', skillsController.postUpdateSkill);
app.get('/skill/delete/:id', skillsController.getDeleteSkill);
app.get('/skill/getSkills/:id', skillsController.getSkillbyId);
app.post('/skill/getSkills/', skillsController.getSkillbyName);
app.get('/getSkills', skillsController.getTechnicalSkills);

/**
  * Error Handler.
  */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
  * Start Express server.
  */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
