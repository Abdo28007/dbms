const express = require('express');
const router = express.Router();

const {
    add_note,
    delete_note,
    update_note,
    get_all_notes,
} = require('../controllers/notes')