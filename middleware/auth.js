const jwt = require('jsonwebtoken');
const db = require("../db/connection")
const cookieparser = require('cookie-parser')
require('dotenv').config();


exports.IsAuth = async (req, res, next) => {
  try {
    const token = req.cookies.university_dz_cookie
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        let email = decodedToken.user_email
        var [result] = await db.query("SELECT * FROM adminstation WHERE admin_email = ?", [email]);
        if (result.length ===0) {
            return res.status(401).render('login',{message : "account not found"});
        }
        req.user_email = email;
        next(null);
    } else {
      return res.status(401).render('login',{message : "invalid cridential"})
    }
  } catch (error) {
    console.log(error);
            if(error.name === 'JsonWebTokenError'){
                return res.render("login",{success  : false ,message :'not autorizated'})
            }
            if(error.name === 'TokenExpiredError'){
                return res.render("login",{success  : false ,message :'session failed sign in '})
            }
            return res.render("login",{success  : false ,message :'Internel server error  '})
        }
  }




