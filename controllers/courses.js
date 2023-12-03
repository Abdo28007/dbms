
const express = require('express')
const db = require('../db/connection');



const createCourse = async (req,res,next) => {
    const {course_name,course_credits,prof_course	} = req.body
    const newCourse = {
        course_name : course_name,
        course_credits : course_credits,
        prof_course : prof_course
    }
    db.query('INSERT INTO courses SET ?', newCourse, (err, results) => {
        if (err) {
            res.status(400).json({ err })
        } else {
            res.status(201).json({ message: 'course created successfully',"course":  results[0]});
        }})
}

const delete_course = async (req,res) => {
    
}

const update_course = async (req,res) => {
    
}
const get_all_courses = async (req,res) => {
    const courses = db.query("select * from courses where 1",(req,res) => {
        if(err){
            res.status(500).json({err})
        }else{
            res.status(200).json({courses})
        }
        
    })
}
module.exports = {
    createCourse,
    delete_course,
    update_course,
    get_all_courses,
};
