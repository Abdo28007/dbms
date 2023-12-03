const express = require('express');
const router = express.Router();


const {
    createCourse,
    delete_course,
    update_course,
    get_all_courses,
} = require('../controllers/courses')