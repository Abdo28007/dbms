const db = require('../db/connection');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const IsAuth = require('../middleware/auth')

require('dotenv').config();

const create_student_account = async (req,res) => {
    try {
        const { name, email, adress, wilaya, bday, phone_number, study_year, study_groupe , departement} = req.body
        const [exictingDepartement] = await db.query("select * from  departments where  departement_name =? ",[departement])
        if(exictingDepartement.length === 0){
            return res.status(409).render("add_student",{ message: 'departement not found create one' })
        }
        let [users] = await db.query("select * from students where student_email = ?", [email])
        console.log(users);
        if (users.length !== 0) {
            return res.status(409).redirect("/home/students")
        }else{
            const [exictingGroupe] = await db.query("select * from groupes where  groupe_name =? ",[study_groupe])
            if(exictingGroupe.length === 0){
                return res.status(409).render("add_student",{ message: 'groupe not found create one' })
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
        return res.status(500).render("add_student",{ message : err.message })
 }


}
const update_student_account = async (req,res) => {
    try {
        let id = req.params.id;
        console.log(id);
        const { student_name, student_adress, student_wilaya, student_bday, student_phone_number ,study_year ,study_groupe,departement } = req.body
        const [exictingGroupe] = await db.query("select * from groupes where  groupe_name =? ",[study_groupe])
        // console.log(exictingGroupe[0]);
        const [exictingDepartement] = await db.query("select * from departments where  departement_name =? ",[departement])
        // console.log(exictingDepartement[0]);
        if(exictingGroupe.length === 0){
            return res.status(409).json({ message: 'groupe not found create one' })
        }
        if(exictingDepartement.length === 0){
            return res.status(409).json({ message: 'departement not found create one' })
        }

        const [student] = await db.query("select * from students where id = ?", [id])
        console.log(student[0]);
        if (student.length == 0) {
            return res.status(404).json({ message: 'No user found with this email' })
        }
        const updatedStudent = {
            student_name: student_name,
            student_adress: student_adress,
            student_wilaya: student_wilaya,
            student_bday: student_bday,
            student_phone_number: student_phone_number,
            student_study_year : study_year,
            student_groupe : exictingGroupe[0].groupe_id,
            student_departement : exictingDepartement[0].departement_id
        }
        const updated_student = await db.query('UPDATE students set ? WHERE id=?', [updatedStudent, id])
        return res.status(201).json({ message: 'student updated successfully', "student ": updatedStudent });
    } catch (error) {
        res.status(500).json({ error })

    }
    
}
const delete_student_account = async (req,res) => {
    try {
        const { id } = req.params;
        const [student] = await db.query("select * from students where id = ?", [id])
        if (student.length == 0) {
            return res.status(404).render('students',{ message: 'No user found with this email' })
        }
        await db.query('DELETE FROM students WHERE id = ?', [id])
        res.status(201).redirect("/home/students");
    } catch (error) {
        res.status(500).render('students',{ error })
    }
    
}
const get_all_students = async (req, res) => {
    try {
        const [students] = await db.query("select * from students where 1")
        res.status(200).render("students" , {students})
    } catch (error) {
        res.status(500).json({ error })

    }

}
const get_student_profile = async (req,res) => {
    const {id} = req.params
    const [students] = await db.query("select * from students where id = ?" , [id])
    const student = students[0]
    const [student_departement] = await db.query("select departement_name from departments where departement_id = ?",[student.student_departement])
    const [groupe] = await db.query("select groupe_name from groupes where groupe_id = ?",[student.student_groupe])
    console.log(student);
    res.status(200).render("student_profile",{student , 
                                            departement : student_departement[0].departement_name ,
                                            groupe : groupe[0].groupe_name
                                        })
}
const create_professor_account = async (req,res) => {
    try {
        const {name, email, adress, wilaya, bday, phone_number,  departement  } = req.body
        const [exictingDepartement] = await db.query("select * from departments where  departement_name =? ",[departement])
        if(exictingDepartement.length === 0){
            return res.status(409).render("add_professor",{ message: 'departement not found create one' })
        }else{
            const [professors] = await db.query("select * from professors where professor_email = ?", [email])
            if (professors.length !== 0) {
                return res.status(409).render( "teachers" ,{ message: 'user account  already exists with this email' })
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
        return res.render("add_professor",{ error })
    }
}
const delete_professor_account = async (req,res) => {
    try {
        const { id } = req.params;
        const [professor] = await db.query("select * from professors where id =? ", id)
        if (professor.length == 0) {
            return res.status(404).json({ message: 'No user found with this email' })
        }
        await db.query('DELETE FROM professors WHERE id = ?', [id])
        res.status(201).redirect("/home/professors");
    } catch (error) {
        res.status(500).render("teachers",{ error })
    }
}
const update_prof_account = async (req,res) => {
    try {
        const email = req.params.professor_email;
        const { professor_name, professor_adress, professor_wilaya, professor_bday, professor_phone_number , departement} = req.body
        const [new_departement]= await db.query("select * from professors where departement_name = ?", [departement])
        if(new_departement.length === 0){
            return res.status(409).json({ message: 'departement not found create one' })
        }
        const [professor] = await db.query("select * from professors where professor_email = ?", [email])
        if (professor.length == 0) {
            return res.status(404).json({ message: 'No user found with this email' })
        }
        const updatedProf = {
            professor_name: professor_name,
            professor_adress: professor_adress,
            professor_wilaya: professor_wilaya,
            professor_bday: professor_bday,
            professor_phone_number: professor_phone_number,
            professor_departement : new_departement.departement_id
        }
        const updated_prof = await db.query('UPDATE professors set ? WHERE professor_email=?', [updatedProf, email])
        return res.status(201).json({ message: 'professor updated successfully' });
    } catch (error) {
        res.status(500).json({ error })
    }
}
const get_all_profs = async (req, res) => {
    try {
        const [professors] = await db.query("select * from professors where 1")
        res.status(200).render('teachers',{ professors })
    } catch (error) {
        console.log(error);
        res.status(500).render("bdd",{ error })
    }
}
const get_professor_profile = async (req,res) => {
    const {id} = req.params
    const [professors] = await db.query("select * from professors where id = ?" , [id])
    const professor = professors[0]
    const [professor_departement] = await db.query("select departement_name from departments where departement_id = ?",[professor.professor_departement])
    const departement = professor_departement[0].departement_name
    res.status(200).render("professor_profile",{professor , departement })
}
const get_professor_groupes = async (req,res) => {
    const {id} = req.params
    const [groupes] = await db.query(`select g.groupe_name 
                                        from groupes as g
                                        join prof_groups as pg
                                        on g.groupe_id = pg.groupe_id
                                        WHERE pg.professor_id = ?`,[id])
    res.status(200).render("professor_groupes" , {groupes})
    
}
const add_new_departement = async (req,res) => {
    try {
        const { departement_name, chef_departement_email } = req.body
        const [CHEF] = await db.query(" select * from professors where professor_email =?", [chef_departement_email])
        if(CHEF.length ===0){
            return res.status(409).render("add_departement",{ message: 'chef departement  not found add one' })
        }
        const [departement] = await db.query("select * from departments where  departement_name =? ",[departement_name])
        if(departement.length !== 0){
            return res.status(409).render("departements" ,{message : "departements already exist"})
        }
        const newDepartement = {
            departement_name: departement_name,
            name_chef_department: CHEF[0].professor_name,
            email_chef_departement : chef_departement_email
        }
        const [createdDepartement] = await db.query('INSERT INTO departments SET ?', [newDepartement])
        return res.redirect("/home/departements");
}catch(err){
    console.log(err);
    return res.status(500).render("add_departement",{ err })
}}
const delete_departement = async (req,res) => {
    try {
        const { departement_id } = req.params
        const [exictingDepartement] = await db.query("select * from departments where  departement_id =? ",[departement_id])
        if(exictingDepartement.length === 0){
            return res.status(409).redirect("/home/departements")
        }
        await db.query('DELETE FROM departments WHERE departement_name = ?', [exictingDepartement[0].departement_name])
        return res.status(201).redirect("/home/departements")
        
    } catch (error) {
        console.log(error);
        return res.status(500).render("departements",{ error })
    }
}
const update_departement_info = async (req,res) => {
    try {
        const { departement_id}  = req.params
        const { departement_name, chef_departement_email } = req.body
        const [exictingDepartement] = await db.query("select * from departments where  departement_id =? ",[departement_id])
        if(exictingDepartement.length === 0){
            return res.status(409).json({ message: 'departement not found' })
        }
        const [existing_chef] = db.query("select * from professors where professor_email = ?" , [chef_departement_email])
        if(existing_chef.length ===0){
            return res.status(409).json({ message: 'chef departement  not found add one' })
        }
        const updatedDepartement = {
            departement_name: departement_name,
            name_chef_departement: chef_departement_email
        }
        const updatedDepartementInfo = await db.query('UPDATE departments set ? WHERE departement_name=?', [updatedDepartement, departement_name])
        return res.status(201).json({ message: 'departement updated successfully' }); 
    } catch (error) {
        return res.status(500).json({error})
    }
}
const get_all_departements =async (req,res) => {
    try {
        const [departements] = await db.query("select * from departments where 1")
        res.status(200).render("departements",{ departements })
        
    } catch (error) {
        return res.status(500).render("departements",{ error })
    }
    
}
const add_admin = async (req,res) => {
    try {
        const { admin_name,email, password } = req.body
        const [existingAdmin] = await db.query("select * from adminstation where admin_email = ?" , [email])
        if(existingAdmin.length !== 0){
            return res.status(409).json({ message: 'admin already exist' })
        }
        const hashed_password = await bcrypt.hash(password, 10)
        const newAdmin = {
            admin_name:admin_name,
            admin_email: email,
            admin_password: hashed_password
        }
        const createdAdmin = await db.query('INSERT INTO adminstation SET ?', [newAdmin])
        return res.status(201).json({ message: 'admin created successfully'}); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
        
    }
}
const delete_admin = async (req,res) => {
    try {
        const { admin_email } = req.params
        const [exictingAdmin] = await db.query("select * from adminstation where  admin_email =? ",[admin_email])
        if(exictingAdmin.length === 0){
            return res.status(409).json({ message: 'admin not found' })
        }
        await db.query('DELETE FROM adminstation WHERE admin_email = ?', [admin_email])
        return res.status(201).json({ message: 'admin deleted successfully' })       
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error }) 
    }
}
const update_admin = async (req,res)=>{    
    try {
        const { admin_email } = req.params
        const { admin_name, admin_password } = req.body
        const [exictingAdmin] = await db.query("select * from adminstation where  admin_email =? ",[admin_email])
        if(exictingAdmin.length === 0){
            return res.status(409).json({ message: 'admin not found' })
        }
        const hashed_password = await bcrypt.hash(admin_password, 10)
        const updatedAdmin = {
            admin_name: admin_name,
            admin_password: hashed_password
        }
        const updatedAdminInfo = await db.query('UPDATE adminstation set ? WHERE admin_email=?', [updatedAdmin, admin_email])
        return res.status(201).json({ message: 'admin updated successfully' }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}  
const get_all_admins = async (req,res) => {
    try {
        const [all_admins] = await db.query("select * from adminstation")
        res.status(200).json({ all_admins })
        
    } catch (error) {
        res.status(500).json({ error })
    }
    
}
const add_course = async (req,res) => {
    try {
        const { course_name , course_credits , studying_year , semestre} = req.body
        const [existingCourse] = await db.query("select * from courses where course_name = ?" , [course_name])
        if(existingCourse.length !== 0){
            return res.status(409).redirect("/home/courses");
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

        return res.status(500).render("add_course",{ error })
    }
}
const get_all_courses = async (req,res) => {
    try {
        const [courses] = await db.query("select * from courses")
        return res.render("courses",{ courses })
    } catch (error) {
        return res.status(500).redirect("/home")
    }
}
const update_course = async (req,res) => {
    try {
        const { course_id}  = req.params
        const { course_name , course_crdits , studying_year} = req.body
        const [existingCourse] = await db.query("select * from courses where course_id = ?" , [course_id])
        if(existingCourse.length === 0){
            return res.status(409).json({ message: 'course not found' })
        }
        const updatedCourse = {
            course_name: course_name,
            course_crdits: course_crdits,
            studying_year: studying_year
        }
        const updatedCourseInfo = await db.query('UPDATE courses set ? WHERE course_id=?', [updatedCourse, course_id])
        return res.status(201).json({ message: 'course updated successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
        
    }
}
const delete_course =async (req,res) => {
    try {
        const { course_id } = req.params
        const [exictingCourse] = await db.query("select * from courses where  course_id =? ",[course_id])
        if(exictingCourse.length === 0){
            return res.status(409).json({ message: 'course not found' })
        }
        await db.query('DELETE FROM courses WHERE course_id = ?', [course_id])
        return res.status(201).redirect("/home/courses")
    }catch(error){
        console.log(error)
        return res.status(500).render("courses",{ error })
    }
}


const create_groupe = async (req,res) => {
    try {
        const {groupe_name , section , departement} = req.body
        const [existingDepartement] = await db.query("select * from departments where departement_name = ?" , [departement])
        if(existingDepartement.length === 0){
            return res.status(409).render("add_groupe", {message :"departement not foun create one"});
        }
        const [existingGroupe] = await db.query("select * from groupes where groupe_name = ?" , [groupe_name])
        if(existingGroupe.length !== 0){
            return res.status(409).redirect("/home/groupes");
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
        return res.status(500).render("add_groupe",{ error }) 
}
}


const delete_groupe = async (req,res) => {
    try {
        const { id } = req.params
        const [exictingGroupe] = await db.query("select * from groupes where  groupe_id =? ",[id])
        if(exictingGroupe.length === 0){
            return res.status(409).render("groupes",{ message: 'groupe not found' })
        }
        await db.query('DELETE FROM groupes WHERE groupe_id = ?', [id])
        return res.status(201).redirect("/home/groupes")
    } catch (error) {
        console.log(error);
        return res.status(500).render("groupes",{ error })
    }
}

const get_all_groupes = async (req,res) => {
    try {
        const [groupes] = await db.query("select * from groupes where 1")
        return res.render('groupes',{groupes})
    } catch (error) {
        console.log(error);
        return res.redirect('/home')
        
    }

}



const student_list = async (req,res) => {
    try {
        const { id } = req.params
        console.log(id);
        const [exictingGroupe] = await db.query("select * from groupes where  groupe_id =? ",[id])
        if(exictingGroupe.length === 0){
            return res.status(409).render("groupes",{ message: 'groupe not found' })
        }
        const [students] = await db.query("select * from students where student_groupe = ?" , [id])
        console.log(students);
        return res.render('student_list',{students})
    } catch (error) {   
        console.log(error);
        return res.redirect('/home')
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
    update_departement_info,
    delete_departement,
    get_all_departements,
    add_admin,
    update_admin,
    delete_admin,
    get_all_admins, 
    add_course,
    update_course, 
    delete_course,
    get_all_courses,
    get_student_profile,
    get_professor_profile,
    get_professor_groupes,
    delete_groupe,
    create_groupe,
    get_all_groupes,
    student_list

}