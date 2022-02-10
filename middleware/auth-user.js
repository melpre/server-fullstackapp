// Extra Credit -- see lines 47-55

'use strict';

// import npm library for basic authentication
const auth = require('basic-auth');
// import bcrypt module
const bcrypt = require('bcryptjs');
// import User model via index.js in models folder and access its property
const { User } = require('../models');


exports.authenticateUser = async (req, res, next) => {
    let message; // store the message to display

    // parse user's credentials from Authorization header
    const credentials = auth(req);

    // if user's credentials are available...
    if (credentials) {
        // retrieve user from data store by username (i.e. user's "key" from Authorization header)
        const user = await User.findOne({ where: {emailAddress: credentials.name} });

        // if user was successfully retrieved from data store...
        if (user) {
            // use bcrypt npm package to compare user's password
            // to user's password retrieved from data store
            const authenticated = bcrypt.compareSync(credentials.pass, user.password)
            // If passwords match...
            if (authenticated) {
                console.log(`Authentication successful for user: ${user.emailAddress}`);
                // store retrieved user object on the request object
                // so any middleware functions that follow this middleware function
                // will have access to the user's information.
                req.currentUser = user;
            } else {
                message = `Authentication failure for user: ${credentials.name}`;
            }
        } else {
            message = `User not found for: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    };

    // if user authentication failed...
    if (message) {
        console.warn(message);
        // return a response with a 401 Unauthorized HTTP status code
        res.status(401).json({ message: 'Access denied' });
    } else {
        // or if user authentication succeeded, call next() method
        next();
    };
};