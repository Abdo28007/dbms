
const db = require('../db/connection');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config();


const log_in = async (req, res) => {
    try {
        let { email, password } = req.body;
        let [admin] = await db.query("select * from adminstation where admin_email =  ?", [email])
        if (admin && admin.length == 0) {
             return res.render('login', {message : "account not found"});
        }
        let user_password = admin[0].admin_password
        let user_email = admin[0].admin_email
        let user_type = "admin"
        const is_matched = await bcrypt.compare(password, user_password)
        if (!is_matched) {
            return res.render("login",{message : "password do not match try again"})
        }
        const token = await jwt.sign({ user :user_email, user_type: user_type }, process.env.SECRET_KEY, { expiresIn: '1d' });
        // store token in cookies with 1 day exiration date 
        res.cookie('university_dz_cookie', token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), httpOnly: true })
        console.log(admin[0]);
        return res.status(200).redirect("/home")
    } catch (err) {
        return res.status(500).json({ err });
    }
}


const search = async (req, res) => {
    try {
        let { filter, key } = req.params;
        switch (filter) {
            case "email":
                [users] = await db.query("select * from students where email = ?", [key])
                break;
            case "name":
                [users] = await db.query("select * from students where student_name =? ", [key])
                break;
            case "wilaya":
                [users] = await db.query("select * from students where student_wilaya = ?", [key])
                break;
            case "study_year":
                [users] = await db.query("select * from students where student_study_year =? ", [key])
                break;
            default:
                return res.status(404).json({ message: 'cannot find ' })
        }
        if (users && users.length !== 0) {
            res.status(200).json({ users })
        } else {
            res.status(404).json({ "message": "cannot find" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }

}



const log_out = async (req, res) => {
    try {
        await res.clearCookie('token');
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
