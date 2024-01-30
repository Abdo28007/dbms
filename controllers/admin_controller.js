const db = require('../db/connection');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const IsAuth = require('../middleware/auth')
require('dotenv').config();

const create_student_account = async (req, res, next) => {
    try {
        const { name, email, adress, wilaya, bday, phone_number, study_year, study_groupe, departement } = req.body
        const [exictingDepartement] = await db.query("select * from  departments where  departement_name =? ", [departement])
        if (exictingDepartement.length === 0) {
            return res.status(409).render("add_student", { message: 'departement not found create one' })
        }
        let [users] = await db.query("select * from students where student_email = ?", [email])
        if (users.length !== 0) {
            const [students] = await db.query("select * from students where 1")
            return res.status(409).render( "students", {students : students ,message:"student already existe"})
        } else {
            const [exictingGroupe] = await db.query("select * from groupes where  groupe_name =? ", [study_groupe])
            if (exictingGroupe.length === 0) {
                return res.status(409).render("add_student", { message: 'groupe not found create one' })
            }
            const newStudent = {
                student_name: name,
                student_email: email,
                student_adress: adress,
                student_wilaya: wilaya,
                student_bday: bday,
                student_phone_number: phone_number,
                student_study_year: study_year,
                student_groupe: exictingGroupe[0].groupe_id,
                student_departement: exictingDepartement[0].departement_id
            }
            const [created_user] = await db.query('INSERT INTO students SET ?', [newStudent])
            return res.status(201).redirect('/home/students');
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).render("students", { students :[],message: err.message })
    }


}
const update_student_account = async (req, res, next) => {
    try {
        let id = req.params.id;
        const { student_name, student_email, student_adress, student_wilaya, student_bday, student_phone_number, study_year, study_groupe, departement } = req.body
        const data = req.body
        data.id = id
        const [user] = await db.query("select * from professors where professor_email = ?", [student_email])
        if (user.length !== 0) {
            return res.status(409).render("update_student", {data , student_departement: departement ,student_groupe :study_groupe , message :"email already taken choose another one" })
        } else {
            const [user] = await db.query("select * from adminstation where admin_email = ?", [student_email])
            if (user.length !== 0) {
                return res.status(409).render("update_student", {data , student_departement: departement ,student_groupe :study_groupe , message :"email already taken choose another one" })
            }
            const [exictingGroupe] = await db.query("select * from groupes where  groupe_name =? ", [study_groupe])
            const [exictingDepartement] = await db.query("select * from departments where  departement_name =? ", [departement])
            if (exictingGroupe.length === 0) {
                return res.status(409).render("update_student", {data , student_departement: departement ,student_groupe :study_groupe , message :"groupe does not existe" })
            }
            if (exictingDepartement.length === 0) {
                return res.status(409).render("update_student", {data , student_departement: departement ,student_groupe :study_groupe , message :"departement does not existe" })
            }
            const [student] = await db.query("select * from students where id = ?", [id])
            if (student.length == 0) {
                return res.status(404).render("bdd",{message:"account not found"})
            }
            const updatedStudent = {
                student_name: student_name,
                student_email: student_email,
                student_adress: student_adress,
                student_wilaya: student_wilaya,
                student_bday: student_bday,
                student_phone_number: student_phone_number,
                student_study_year: study_year,
                student_groupe: exictingGroupe[0].groupe_id,
                student_departement: exictingDepartement[0].departement_id
            }
            const updated_student = await db.query('UPDATE students set ? WHERE id=?', [updatedStudent, id])
            return res.status(201).render("student_profile",{
                student : data,
                departement : exictingDepartement[0].departement_name,
                groupe : exictingGroupe[0].groupe_name,
                message : "student updated successfully"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).render("students", { message :error.message , students : [] })

    }

}
const delete_student_account = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [student] = await db.query("select * from students where id = ?", [id])
        if (student.length == 0) {
            const [students] = await db.query("select * from students where 1")
            return res.status(404).render('students', { students ,message: 'No user found' })
        }
        await db.query('DELETE FROM students WHERE id = ?', [id])
        res.status(201).redirect("/home/students");
    } catch (error) {
        res.status(500).render('students', { students :[], message : error.message })
    }

}
const get_all_students = async (req, res, next) => {
    try {
        const [students] = await db.query("select * from students where 1")
        res.status(200).render("students", { students , message : "" })
    } catch (error) {
        console.log(error);
        res.status(500).render("bdd", { message : error.message })
    }

}
const get_student_profile = async (req, res, next) => {
try {
    const { id } = req.params
    const [students] = await db.query("select * from students where id = ?", [id])
    if (students.length ==0){
        const [ata] = await db.query("select * from students where 1")
        return res.status(404).render("students",{students : ata,message:"account not found"})
    }
    const student = students[0]
    const [student_departement] = await db.query("select departement_name from departments where departement_id = ?", [student.student_departement])
    const [groupe] = await db.query("select groupe_name from groupes where groupe_id = ?", [student.student_groupe])
    res.status(200).render("student_profile", {
        student,
        departement: student_departement[0].departement_name,
        groupe: groupe[0].groupe_name,
        message :""
    })
} catch (error) {
    console.log(error);
    res.status(500).render("bdd", { message : error.message })  
}
}
const create_professor_account = async (req, res, next) => {
    try {
        const { name, email, adress, wilaya, bday, phone_number, departement } = req.body
        const [exictingDepartement] = await db.query("select * from departments where  departement_name =? ", [departement])
        if (exictingDepartement.length === 0) {
            return res.status(409).render("add_professor", { message: 'departement not found create one' })
        } else {
            const [professors] = await db.query("select * from professors where professor_email = ?", [email])
            if (professors.length !== 0) {
                
                return res.status(409).render("professors", {professorss, message: 'user account  already exists with this email' })
            } else {
                const newProfessor = {
                    professor_name: name,
                    professor_email: email,
                    professor_adress: adress,
                    professor_wilaya: wilaya,
                    professor_bday: bday,
                    professor_phone_number: phone_number,
                    professor_departement: exictingDepartement[0].departement_id
                }
                const [created_user] = await db.query('INSERT INTO professors SET ?', [newProfessor])
                return res.status(201).redirect("/home/professors");
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).render("bdd", { mesage :error.message })
    }
}
const delete_professor_account = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [professor] = await db.query("select * from professors where id =? ", id)
        if (professor.length == 0) {
            const [professorss] = await db.query("select * from professors where 1")
            return res.status(404).render('professors',{professors : professorss, message :'no professor found' })
        }
        await db.query('DELETE FROM professors WHERE id = ?', [id])
        res.status(201).redirect("/home/professors");
    } catch (error) {
        console.log(error);
        return res.render('bdd',{message : error.message})
        
    }
}
const update_prof_account = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { professor_name, professor_email, professor_adress, professor_wilaya, professor_bday, professor_phone_number, departement } = req.body
        const data = req.body
        data.id = id
        const [new_departement] = await db.query("select * from departments where departement_name = ?", [departement])
        if (new_departement.length === 0) {
            return res.status(409).render("update_professor",{data , departement , message :"departement not found"})
        }
        const [user] = await db.query("select * from students where student_email = ?", [professor_email])
        if (user.length !== 0) {
            return res.status(409).render("update_professor",{data , departement , message :"email already taken "})
        } else {
            const [user] = await db.query("select * from adminstation where admin_email = ?", [professor_email])
            if (user.length !== 0) {
                return res.status(409).render("update_professor",{data , departement , message :"email already taken "})
            }
        }
        const [professor] = await db.query("select * from professors where id = ?", [id])
        if (professor.length == 0) {
            const [professors] = await db.query("select * from professors where 1")
            return res.status(409).render("professors",{professors , message :"account not found"})
        }
        const updatedProf = {
            professor_name: professor_name,
            professor_email: professor_email,
            professor_adress: professor_adress,
            professor_wilaya: professor_wilaya,
            professor_bday: professor_bday,
            professor_phone_number: professor_phone_number,
            professor_departement: new_departement[0].departement_id
        }
        const updated_prof = await db.query('UPDATE professors set ? WHERE professor_email=?', [updatedProf, professor_email])
        return res.status(201).redirect(`/home/professors/${id}/profile`);
    } catch (error) {
        console.log(error);
        res.status(500).render("bdd", { error })
    }
}
const get_all_profs = async (req, res, next) => {
    try {
        const [professors] = await db.query("select * from professors where 1")
        res.status(200).render('teachers', { professors , message : "" })
    } catch (error) {
        console.log(error);
        res.status(500).render("bdd", { error })
    }
}
const get_professor_profile = async (req, res, next) => {
try {
    const { id } = req.params
    const [professors] = await db.query("select * from professors where id = ?", [id])
    if (professors.length == 0) {
        const [professors] = await db.query("select * from professors where 1")
        return res.status(404).render('teachers',{professors , message :'no professor found' })
    }
    const professor = professors[0]
    const [professor_departement] = await db.query("select departement_name from departments where departement_id = ?", [professor.professor_departement])
    const departement = professor_departement[0].departement_name
    res.status(200).render("professor_profile", { professor, departement , message : "" })
} catch (error) {
    console.log(error);
    res.status(500).render("bdd", { error })
    
}
}
const get_professor_groupes = async (req, res, next) => {
try {
    const { id } = req.params
    const [groupes] = await db.query(`select g.groupe_name 
                                        from groupes as g
                                        join prof_groups as pg
                                        on g.groupe_id = pg.groupe_id
                                        WHERE pg.professor_id = ?`, [id])
    res.status(200).render("professor_groupes", { groupes ,professor_id : id,message:""})
} catch (error) {
    console.log(error);
    res.status(500).render("bdd", { error })
    
}

}
const add_new_departement = async (req, res, next) => {
    try {
        const { departement_name, chef_departement_email } = req.body
        const [CHEF] = await db.query(" select * from professors where professor_email =?", [chef_departement_email])
        if (CHEF.length === 0) {
            return res.status(409).render("add_departement", { message: 'chef departement  not found add one' })
        }
        const [departement] = await db.query("select * from departments where  departement_name =? ", [departement_name])
        if (departement.length !== 0) {
            const [departements]= await db.query("select * from departments where 1")
            return res.status(409).render("departements", {departements, message: "departements already exist" })
        }
        const newDepartement = {
            departement_name: departement_name,
            name_chef_department: CHEF[0].professor_name,
            email_chef_departement: chef_departement_email
        }
        const [createdDepartement] = await db.query('INSERT INTO departments SET ?', [newDepartement])
        return res.redirect("/home/departements");
    } catch (err) {
        console.log(err);
        return res.status(500).render("bdd", { message:err.message })
    }
}
const delete_departement = async (req, res, next) => {
    try {
        const { departement_id } = req.params
        const [exictingDepartement] = await db.query("select * from departments where  departement_id =? ", [departement_id])
        const [departements] = await db.query("select * from departments where 1")
        if (exictingDepartement.length === 0) {
            return res.status(409).render("departements", {departements, message: 'departement not found' })
        }
        await db.query('DELETE FROM departments WHERE departement_name = ?', [exictingDepartement[0].departement_name])
        return res.status(201).redirect("/home/departements")

    } catch (error) {
        console.log(error);
        return res.status(500).render("bdd", { message : error.message })
    }
}

const get_all_departements = async (req, res, next) => {
    try {
        const [departements] = await db.query("select * from departments where 1")
        res.status(200).render("departements", { departements , message :"" })

    } catch (error) {
        return res.status(500).render("bdd", { message :error.message })
    }

}
const add_course = async (req, res, next) => {
    try {
        const { course_name, course_credits, studying_year, semestre } = req.body
        const [existingCourse] = await db.query("select * from courses where course_name = ?", [course_name])
        if (existingCourse.length !== 0) {
            const [courses]= await db.query("select * from courses where 1")
            return res.status(409).render("courses",{courses,message : "course already existe"});
        }
        const newCourse = {
            course_name: course_name,
            course_credits: course_credits,
            studying_year: studying_year,
            semestre: semestre
        }
        const createdCourse = await db.query('INSERT INTO courses SET ?', [newCourse])
        return res.status(201).redirect("/home/courses");

    } catch (error) {
        console.log(error);
        return res.status(500).render("bdd", { message: error.mesage })
    }
}
const get_all_courses = async (req, res, next) => {
    try {
        const [courses] = await db.query("select * from courses")
        return res.render("courses", { courses , message : ""})
    } catch (error) {
        console.log(error);
        return res.status(500).redirect("bdd", {message : error.mesage})
    }
}
const delete_course = async (req, res, next) => {
    try {
        const { course_id } = req.params
        const [exictingCourse] = await db.query("select * from courses where  course_id =? ", [course_id])
        if (exictingCourse.length === 0) {
            const [courses] = await db.query("select * from courses")
            return res.status(409).render("courses",{ courses,message: 'course not found' })
        }
        await db.query('DELETE FROM courses WHERE course_id = ?', [course_id])
        return res.status(201).redirect("/home/courses")
    } catch (error) {
        console.log(error)
        return res.status(500).render("bdd", { message:error.mesage })
    }
}
const create_groupe = async (req, res, next) => {
    try {
        const { groupe_name, section, departement } = req.body
        const [existingDepartement] = await db.query("select * from departments where departement_name = ?", [departement])
        if (existingDepartement.length === 0) {
            return res.status(409).render("add_groupe", { message: "departement not foun create one" });
        }
        const [existingGroupe] = await db.query("select * from groupes where groupe_name = ?", [groupe_name])
        if (existingGroupe.length !== 0) {
            const [groupes] = await db.query("select * from groupes where 1")
            return res.status(409).render("groupes" , {groupes , message :'groupe already existe'});
        }
        const newGroupe = {
            groupe_name: groupe_name,
            groupe_section: section,
            departement_id: existingDepartement[0].departement_id
        }
        const createdGroupe = await db.query('INSERT INTO groupes SET ?', [newGroupe])
        return res.status(201).redirect("/home/groupes");

    } catch (error) {
        console.log(error);
        return res.status(500).render("bd", { message:error.message })
    }
}
const delete_groupe = async (req, res, next) => {
    try {
        const { id } = req.params
        const [exictingGroupe] = await db.query("select * from groupes where  groupe_id =? ", [id])
        if (exictingGroupe.length === 0) {
            const [groupes] = await db.query("select * from groupes")
            return res.status(409).render("groupes", { groupes , message: 'groupe not found' })
        }
        await db.query('DELETE FROM groupes WHERE groupe_id = ?', [id])
        return res.status(201).redirect("/home/groupes")
    } catch (error) {
        console.log(error);
        return res.status(500).render("bdd", { message : error.message })
    }
}
const get_all_groupes = async (req, res, next) => {
    try {
        const [groupes] = await db.query("select * from groupes where 1")
        return res.render('groupes', { groupes , message:"" })
    } catch (error) {
        console.log(error);
        return res.render('bdd',{message : error.message})

    }

}

const student_list = async (req, res, next) => {
    try {
        const { id } = req.params
        const [exictingGroupe] = await db.query("select * from groupes where  groupe_id =? ", [id])
        if (exictingGroupe.length === 0) {
            const [groupes] = await db.query("select * from groupes where 1")
            return res.status(409).render("groupes", {groupes, message: 'groupe not found' })
        }
        const [students] = await db.query("select * from students where student_groupe = ?", [id])
        return res.render('student_list', { students  , message :""})
    } catch (error) {
        console.log(error);
        return res.render('bdd',{message:error.message})
    }

}
module.exports = {
    create_student_account,
    update_student_account,
    delete_student_account,
    get_all_students,
    create_professor_account,
    update_prof_account,
    delete_professor_account,
    get_all_profs,
    add_new_departement,
    delete_departement,
    get_all_departements,
    add_course,
    delete_course,
    get_all_courses,
    get_student_profile,
    get_professor_profile,
    get_professor_groupes,
    delete_groupe,
    create_groupe,
    get_all_groupes,
    student_list,


}