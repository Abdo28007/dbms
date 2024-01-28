const express = require('express');
const router = express.Router();
const IsAuth = require("../middleware/auth")

const {   
    create_student_account,
    update_student_account,
    delete_student_account,
    get_all_students,
    get_student_profile,

    create_professor_account,
    update_prof_account,
    delete_professor_account,
    get_all_profs,
    get_professor_profile,
    get_professor_groupes,

    add_new_departement,
    update_departement_info,
    delete_departement,
    get_all_departements,

    add_admin,
    update_admin,
    delete_admin,
    get_all_admins,
    // get_admin_profile,
    
    add_course,
    update_course, 
    delete_course,
    get_all_courses,
    get_all_groupes,
    create_groupe,
    delete_groupe,
    student_list,

} = require("../controllers/admin_controller")







router.post("/home/students/create",create_student_account)
router.post("/home/professors/create",create_professor_account)
router.post('/home/courses/create',add_course);
router.post('/home/departements/create', add_new_departement);
router.post('/home/groupes/create', create_groupe);






router.get("/home/students/:id/profile",get_student_profile)
router.get("/home/professors/:id/profile",get_professor_profile)
router.get('/home/professors/:id/groupes', get_professor_groupes);
router.get('/home/groupes/:id/list_students',student_list )


router.get('/home/students/:id/delete',delete_student_account /* Delete Student Controller/Middleware */);
router.get('/home/professors/:id/delete', delete_professor_account);
router.get('/home/courses/:course_id/delete',delete_course);
router.get('/home/departments/:departement_id/delete', delete_departement);
router.get('/home/groupes/:id/delete',delete_groupe )






router.get('/home/students', get_all_students);
router.get('/home/professors',get_all_profs);
router.get('/home/courses',get_all_courses);
router.get('/home/departements', get_all_departements);
router.get('/home/groupes',get_all_groupes);   





// router.put('/home/students/:id/update',update_student_account );
router.get('/home/administrators',get_all_admins )
router.post('/home/administrators/create',add_admin );
router.get('/home/administrators/:id/delete',delete_admin )
// router.put('/home/professors/:id/delete',update_prof_account );
// router.put('/courses/:course_id/update',update_course);
// router.put('/departments/:departement_id/update', update_departement_info);













// router.get("/home/administrators/:id/profile",get_admin_profile)







module.exports = router








