const { check, validationResult } = require('express-validator')



exports.UserLoginValidation = [
    check('email').trim().isEmail().withMessage('Email is not valid'),
    check('password').trim().notEmpty().withMessage('Password required')
]

exports.validationResult = (req, res, next) => {
    const resault = validationResult(req).array()
    if (!resault.length) {
        return next()
    }
    const erreur = resault[0].msg
    res.json({ succes: false, message: erreur })

}