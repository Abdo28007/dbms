
const db = require('../db/connection');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config();


const log_in = async (req, res) => {
    try {
        let { email, password } = req.body;
        let [admin] = await db.query("select * from adminstation where admin_email =  ?", [email])
        if (admin && admin.length == 0) {
            return res.render('login', { message: "account not found" });
        }
        let user_password = admin[0].admin_password
        let user_email = admin[0].admin_email
        const is_matched = await bcrypt.compare(password, user_password)
        if (!is_matched) {
            return res.render("login", { message: "password do not match try again" })
        }
        const token = await jwt.sign({ user_email: user_email }, process.env.SECRET_KEY, { expiresIn: '1d' });
        // store token in cookies with 1 day exiration date 
        res.cookie('university_dz_cookie', token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true })
        return res.status(200).redirect("/home")
    } catch (error) {
        console.log(error);
        return res.status(500).render("login", { message: error.message });
    }
}


const search = async (req, res, next) => {
    try {
        const { value } = req.body;
        var result = [];

        var [studentsResult] = await db.query(`SELECT * FROM students WHERE student_name LIKE "%${value}%"`);
        var [professorsResult] = await db.query(`SELECT * FROM professors WHERE professor_name LIKE "%${value}%"`);
        var [coursesResult] = await db.query(`SELECT * FROM courses WHERE course_name LIKE "%${value}%"`);
        var [groupesResult] = await db.query(`SELECT * FROM groupes WHERE groupe_name LIKE "%${value}%"`);
        var [departmentsResult] = await db.query(`SELECT * FROM departments WHERE departement_name LIKE "%${value}%"`);

        if (studentsResult.length > 0) {
            result = studentsResult;
            var result_type = "student";
        } else if (professorsResult.length > 0) {
            result = professorsResult;
            var result_type = "professor";
        } else if (coursesResult.length > 0) {
            result = coursesResult;
            var result_type = "course";
        } else if (groupesResult.length > 0) {
            result = groupesResult;
            var result_type = "group";
        } else if (departmentsResult.length > 0) {
            result = departmentsResult;
            var result_type = "department";
        }
        if (result.length === 0) {
            return res.render("search", { result, message: "No results found" });
        } else {
            return res.render("search", { result, message: "", result_type });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
}

const log_out = async (req, res, next) => {
    try {
        await res.clearCookie('university_dz_cookie');
        res.redirect("/")
    } catch (error) {
        res.send(error)
    }
}





// Export the controllers function
module.exports = {
    search,
    log_in,
    log_out
};
