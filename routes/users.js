
const express = require('express');
const router = express.Router();

// controllers
const {
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
} = require('../controllers/user')




// generale_account
router.post('/create-user',createUser);
// user for only admin 
router.get('/users/user',get_user );
router.delete('delete-user',delete_user)

// login
router.post('/login',log_in );
// logout
router.post('/:user_id/logout',log_out );


// students
router.get('/students',get_all_students );
router.post('/students/create-student',create_student );
router.put('/students/:student_id/update',update_student_account)
router.delete('/students/:student_id/delete',delete_student_account)

//professors

router.get('/professors',get_all_profs );
router.post('/professors/create-professor',create_professor );
router.put('/professors/:professor_id/update',update_prof_account)
router.delete('/professors/:professor_id/delete',delete_prof_account)


module.exports = router;
