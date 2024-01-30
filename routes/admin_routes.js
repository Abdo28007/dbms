const express = require('express');
const router = express.Router();
const { IsAuth } = require("../middleware/auth")

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
    delete_departement,
    get_all_departements,
    add_course,
    delete_course,
    get_all_courses,
    get_all_groupes,
    create_groupe,
    delete_groupe,
    student_list,
    profile,

} = require("../controllers/admin_controller")







router.post("/home/students/create", IsAuth, create_student_account)
router.post("/home/professors/create", IsAuth, create_professor_account)
router.post('/home/courses/create', IsAuth, add_course);
router.post('/home/departements/create', IsAuth, add_new_departement);
router.post('/home/groupes/create', IsAuth, create_groupe);






router.get("/home/students/:id/profile", IsAuth, get_student_profile)
router.get("/home/professors/:id/profile", IsAuth, get_professor_profile)
router.get('/home/professors/:id/groupes', IsAuth, get_professor_groupes);
router.get('/home/groupes/:id/list_students', IsAuth, student_list)


router.get('/home/students/:id/delete', IsAuth, delete_student_account);
router.get('/home/professors/:id/delete', IsAuth, delete_professor_account);
router.get('/home/courses/:course_id/delete', IsAuth, delete_course);
router.get('/home/departments/:departement_id/delete', IsAuth, delete_departement);
router.get('/home/groupes/:id/delete', IsAuth, delete_groupe)






router.get('/home/students', IsAuth, get_all_students);
router.get('/home/professors', IsAuth, get_all_profs);
router.get('/home/courses', IsAuth, get_all_courses);
router.get('/home/departements', IsAuth, get_all_departements);
router.get('/home/groupes', IsAuth, get_all_groupes);





router.post('/home/students/:id/update', IsAuth, update_student_account);
router.post('/home/professors/:id/update', IsAuth, update_prof_account);



module.exports = router








