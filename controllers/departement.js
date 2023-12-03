const express = require('express')
const db = require('../db/connection');

const createDepartement = async (req,res,next) => {
    const {departement_name,name_chef_department,email_chef_departement} = req.body 
    const newDepartement = {
        departement_name : departement_name,
        name_chef_department : name_chef_department,
        email_chef_departement : email_chef_departement
    }
    db.query('INSERT INTO departments SET ?', newDepartement, (err, results) => {
        if (err) {
            res.status(400).json({ err })
        } else {
            res.status(201).json({ message: 'departement created successfully',"departement":  results[0]});
        }})
}

const delete_departement = async (req,res) => {
    
}
const update_departement = async (req,res) => {
    
}


module.exports = {
    createDepartement,
    delete_departement,
    update_departement,
};
