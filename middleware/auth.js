const jwt = require('jsonwebtoken');
const db = require("../db/connection")
const cookieparser = require('cookie-parser')
require('dotenv').config();


exports.IsAuth = async (req, res, next) => {
  try {
    const token = req.cookie.university_dz_token
    if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user_type = decodedToken.user_type
        let email = decodedToken.user.email
        switch(user_type){
            case "admin":
                var [result] = await db.query("SELECT * FROM admins WHERE admin_email = ?", [email]);
                if (result.length ===0) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                break;
            case "professor":
                var [result] = await db.query("SELECT * FROM professors WHERE professor_email = ?", [email]);
                if (result.length ===0) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                break;
            case "student":
                var [result] = await db.query("SELECT * FROM students WHERE student_email = ?", [email]);
                if (result.length ===0) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                break;
            default:
                return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user_email = email;
        req.user_type=user_type;
        next(req);
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
            if(error.name === 'JsonWebTokenError'){
                return res.json({success  : false ,message :'not autorizated'})
            }
            if(error.name === 'TokenExpiredError'){
                return res.json({success  : false ,message :'session failed sign in '})
            }
            return res.json({success  : false ,message :'Internel server error  '})
        }
  }

