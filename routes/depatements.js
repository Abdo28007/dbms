const express = require('express');
const router = express.Router();


const {
    createDepartement,
    delete_departement,
    update_departement,
} = require('../controllers/departement')