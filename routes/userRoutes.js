'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler'); //import async-handler middleware
const { authenticateUser } = require('../middleware/auth-user'); // import authentication middleware

// import User model via index.js in models folder and access its property
const { User } = require('../models');

// construct a router instance
const router = express.Router();


/* USERS ROUTES */
// route that returns authenticated User
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({ 
        email: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id // Add user ID prop to be returned when client fetches data from api 
    }).status(200);
}));

// route that creates new User
router.post('/users', asyncHandler(async (req, res) => {
    // store new user in database
    await User.create(req.body); // use sequelize create method
    // set location header to '/'
    res.set('Location', '/');
    // set status to 201 created and end response
    return res.status(201).end();
}));

module.exports = router;




