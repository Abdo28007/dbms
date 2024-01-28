const express = require('express');
const router = express.Router();
const IsAuth = require("../middleware/auth")
const {UserLoginValidation , validationResult} = require('../middleware/validator/login_validation')
const {
    search,
    log_in,
    log_out
} = require('../controllers/user_controller')



router.post('/login',UserLoginValidation,validationResult,log_in );
router.post('/logout',log_out );
router.get("/home/search/:filter/:key",search)



module.exports = router;
