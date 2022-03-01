////////// NOTES //////////


////////// TO-DO //////////



/******************************************
Treehouse FSJS Techdegree:
project 9 - REST API with Express
by Melissa Preece

// Requirements for 'Exceeds Expectations' grade:
// 1. The GET /api/users route filters out the following properties: password, createdAt, updatedAt
      The POST /api/users route checks for and handles SequelizeUniqueConstraintError errors by returning a 400 status code and error message
      // See files: 
          //  middleware/async-handler.js
          //  middleware/auth-user.js
          //  routes/userRoutes.js
          //  models/user.js
// 2. The GET /api/courses and /api/courses/:id routes filter out the following properties: createdAt, updatedAt
      The PUT /api/courses/:id and DELETE /api/courses/:id routes return a 403 status code if the current user doesn't own the requested course
      // See file: 
          //  routes/coursesRoutes.js
******************************************/

'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const cors = require('cors'); // load CORS module to connect to REACT client

// import route modules
const userRoutes = require('./routes/userRoutes');
const coursesRoutes = require('./routes/coursesRoutes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup CORS to connect to REACT client
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// json parser
app.use(express.json());

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// add routes
app.use('/api', userRoutes, coursesRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}, 
  });
});

/* Original code */
// set up port
// app.set('port', process.env.PORT || 5000);

/* Heroku recommended code */
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, () => {
    console.log(`The application is running on localhost:${port}.`);
});

// test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch(error) {
    console.error('Unable to connect to the database:', error);
  }
})();

/* Original code */
// start listening on port
// const server = app.listen(app.get('port'), () => {
//   console.log(`Express server is listening on port ${server.address().port}`);
// });


