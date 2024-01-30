const express = require('express');
const router = express.Router();
const IsAuth = require("../middleware/auth")
const {UserLoginValidation , validationResult} = require('../middleware/validator/login_validation')
const {
    search,
    log_in,
    log_out
} = require('../controllers/user_controller')



router.post('/login',log_in );
router.get('/home/logout',log_out );
router.post("/home/search",search)



module.exports = router;
