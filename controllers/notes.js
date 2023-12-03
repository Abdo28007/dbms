const express = require('express')
const db = require('../db/connection')

const add_note = async (req,res) => {
    const {student_name,course_name,td_note,tp_note,examen_note} = req.body
    const student_id = req.body.student_id
    const course_id = req.body.course_id
    const grade = (((td_note + tp_note)/2)*0.33 + examen_note*0.67)
    const newNote = {
        student_id : student_id,
        course_name : course_name,
        course_id : course_id,
        grade : grade

    }
}

const update_note = async (req,res) => {
    
}

const delete_note = async (req,res) => {
    
}
const get_all_notes = async (req,res) => {
    const notes = await db.query("select * from notes where 1",(req,res) => {
        if(err){
            res.status(500).json({err})
        }else{
            res.status(200).json({notes})
        }
    })
}

module.exports ={
    add_note,
    delete_note,
    update_note,
    get_all_notes,
}