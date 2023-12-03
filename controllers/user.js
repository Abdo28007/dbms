
// Import any necessary modules or dependencies
const express = require('express')
const db = require('../db/connection');
const bcrypt = require('bcrypt')






// controllers
const createUser = async (req, res) => {
    console.log(req.body);
    var { email, password, confirm_password, student_or_prof } = req.body;
    if (password != confirm_password) {
        res.json({ err: "password do not match try again " })
    }
    const user = await db.query("select * from users where email = ?", email, (req, res) => {
        if (err) {
            res.status(400).json({ err })
        }
    })
    if (user) { res.json({ message: "account already created please log in" }) }
    else {
        const hashed_password = await bcrypt.hash(password, 10)
        const newUser = {
            email: email,
            password: hashed_password,
            student_or_prof: student_or_prof
        };
        db.query('INSERT INTO users SET ?', newUser, (err, results) => {
            if (err) {
                res.status(400).json({ err })
            } else {
                res.status(201).json({ message: 'User created successfully' });
            }

        });
    }
};
const create_student = async (req,res,next) => {
    console.log(req.body);
    const {student_name , student_adress, student_age,student_email,study_year} = req.body
    const newStudent = {
        student_name : student_name,
        student_adress : student_adress,
        student_age : student_age,
        student_email : student_email,
        study_year : study_year
    }
    db.query('INSERT INTO students SET ?', newStudent, (err, results) => {
        if (err) {
            res.status(400).json({ err })
        } else {
            res.status(201).json({ message: 'Student created successfully' , "student " : results[0]});
        }

    });
}
const create_professor = async (req,res,next) => {
    console.log(req.body);
    const {professor_email,professor_name ,professor_adress,professor_age,departement_name} = req.body
    const departement_id = await db.query("select departements_id from departements where departements_name = ? ",departement_name,(req,res) => {
        if(err){
            res.json({err})
        }
    })
    const newProfessor = {
        professor_name : 	professor_name,
        professor_email : professor_email,
        departement_id : departement_id,
        professor_adress : professor_adress,
        professor_age : professor_age
    }
    db.query('INSERT INTO professors SET ?', newProfessor, (err, results) => {
        if (err) {
            res.status(400).json({ err })
        } else {
            res.status(201).json({ message: 'professor created successfully',"professor":  results[0]});
        }

    });
}
const update_student_account = async (req,res,next) => { 
}
const update_prof_account = async (req,res,next) => {    
}
const delete_student_account = async (req,res,next) => {
}
const delete_prof_account = async (req,res,next) => {
}
const get_user = async (req,res) => {   
}
const log_in = async (req,res) => {   
}
const log_out = async (req,res) => {   
}
const get_all_students = async (req,res) => {
    const all_students = await db.query("select * from students where 1",(req,res) => {
        if(err){
            res.status(500).json({err})
        }else{
            res.status(200).json({all_students})
        }
    })
}
const get_all_profs = async (req,res) => {
    const professors = await db.query("select * from professors where 1",(req,res) => {
        if(err){
            res.status(500).json({err})
        }else{
            res.status(200).json({professors})
        }
    })
}
const delete_user = async (req,res) => {   
}
// Export the controllers function
module.exports = {
    createUser,
    create_student,
    create_professor,
    update_student_account,
    update_prof_account,
    delete_student_account,
    delete_prof_account,
    get_user,
    log_in,
    log_out,
    get_all_students,
    get_all_profs,
    delete_user
};
