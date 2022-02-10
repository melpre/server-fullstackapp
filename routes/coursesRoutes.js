'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler'); //import async-handler middleware function
const { authenticateUser } = require('../middleware/auth-user'); // import authentication middleware

// import Course model via index.js in models folder and access its property
const { Course } = require('../models');
// import User model via index.js in models folder and access its property
const { User } = require('../models');

// construct a router instance
const router = express.Router();


/* COURSES ROUTES*/
// route returns list of Courses and User that owns each Course
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
                as: 'instructor',
            }
        ],
    });
    // log courses and users with associations
    console.log(courses.map(course => course.get({ plain: true })));
    res.json({ courses }).status(200);
}));

// route returns corresponding Course and User that owns Course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findOne({ 
        where: {id: req.params.id },
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
                as: 'instructor',
            }
        ],
    });
    // log corresponding course
    // console.log(course);
    // res.json({ course }).status(200);

    // Test to get 404 error
    if (!course) {
        return res.status(404).json({ error: 'Course not found' })
    } else {
        // log corresponding course
        console.log(course);
        return res.json({ course }).status(200);
    }
}));

// route creates new Course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    // get created course from request body 
    const newCourse = await Course.create({ 
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime, // 9/28/21: added estimatedTime prop
        materialsNeeded: req.body.materialsNeeded, // 9/28/21: added materialsNeeded prop
        userId: req.body.userId,
    });
    // log new course
    console.log(newCourse);
    // set Location header to URI for newly created course
    res.location(`/courses/${newCourse.id}`);
    // log location header
    console.log(res.get('location'));
    // set status 201 Created and end response
    return res.status(201).end();
}));

// route updates corresponding Course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    let updateCourse = await Course.findOne({ where: { id: req.params.id }});
    console.log(req.currentUser.id);
    console.log(updateCourse.userId);
    console.log(req.body);
    // if course belongs to current authorized user,
    if (req.currentUser.id === updateCourse.userId) {
        // update response and return in json
        updateCourse.title = req.body.title;
        updateCourse.description = req.body.description;
        updateCourse.userId = req.body.userId;
        await updateCourse.update(req.body);
        // log updated course
        console.log(updateCourse.toJSON());
        // set status 204 and return no content
        return res.status(204).end();
    } else {
        // set status to 403
        return res.status(403).end();
    };
}));

// route deletes corresponding Course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const deleteCourse = await Course.findOne({ where: { id: req.params.id }});
    // if course belongs to current authorized user,
    if (req.currentUser.id === deleteCourse.userId) {
        // log deleted course
        console.log(`${deleteCourse.title} has been deleted`);
        // delete course
        await deleteCourse.destroy();
        // set status 204 and return no content
        return res.status(204).end();
    } else { 
        // set status to 403
        return res.status(403).end();
    };
}));

module.exports = router;




