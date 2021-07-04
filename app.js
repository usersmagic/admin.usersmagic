const bodyParser = require('body-parser');
const cluster = require('cluster');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const i18n = require('i18n');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const CronJob = require('./cron/CronJob');
const MongoStore = require('connect-mongo')(session);

const numCPUs = process.env.WEB_CONCURRENCY || require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  dotenv.config({ path: path.join(__dirname, '.env') });

  if (cluster.worker.id == 2 && !process.env.IS_LOCAL) { // Use the second worker only for CronJobs, to never block traffic on the site. DO NOT USE on local
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/usersmagic';
    mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

    CronJob.start(() => {
      console.log(`Cron jobs are started for every minute on worker ${cluster.worker.id}`);
    });
  } else {
    const app = express();
    const server = http.createServer(app);

    i18n.configure({
      locales:['tr', 'en'],
      directory: __dirname + '/translations',
      queryParameter: 'lang',
      defaultLocale: 'en'
    });

    const PORT = process.env.PORT || 3000;
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/usersmagic';

    const indexRouteController = require('./routes/indexRoute');
    const authRouteController = require('./routes/authRoute');
    const campaignsRouteController = require('./routes/campaignsRoute');
    const caseStudiesRouteController = require('./routes/caseStudiesRoute');
    const countriesRouteController = require('./routes/countriesRoute');
    const companiesRouteController = require('./routes/companiesRoute');
    const comparisonsRouteController = require('./routes/comparisonsRoute')
    const imageRouteController = require('./routes/imageRoute');
    const paymentsRouteController = require('./routes/paymentsRoute');
    const questionsRouteController = require('./routes/questionsRoute');
    const rootAdminRouteController = require('./routes/rootAdminRoute');
    const submitionsRouteController = require('./routes/submitionsRoute');
    const targetsRouteController = require('./routes/targetsRoute');
    const templatesRouteController = require('./routes/templatesRoute');
    const usersRouteController = require('./routes/usersRoute');
    const waitlistRouteController = require('./routes/waitlistRoute');

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    mongoose.connect(mongoUri, { useNewUrlParser: true, auto_reconnect: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

    app.use(express.static(path.join(__dirname, 'public')));

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const sessionOptions = session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    });

    app.use(sessionOptions);
    app.use(cookieParser());
    app.use(i18n.init);
    app.use((req, res, next) => {
      req.query = (req.query && typeof req.query == 'object' ? req.query : {});
      next();
    });

    app.use('/', indexRouteController);
    app.use('/auth', authRouteController);
    app.use('/campaigns', campaignsRouteController);
    app.use('/case_studies', caseStudiesRouteController);
    app.use('/countries', countriesRouteController);
    app.use('/companies', companiesRouteController);
    app.use('/comparisons', comparisonsRouteController);
    app.use('/image', imageRouteController);
    app.use('/payments', paymentsRouteController);
    app.use('/questions', questionsRouteController);
    app.use('/root_admin', rootAdminRouteController);
    app.use('/submitions', submitionsRouteController);
    app.use('/targets', targetsRouteController);
    app.use('/templates', templatesRouteController);
    app.use('/users', usersRouteController);
    app.use('/waitlist', waitlistRouteController);

    server.listen(PORT, () => {
      console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);
    });
  }
}
