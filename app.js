const express = require('express')
const port = 5500
const app = express()
const db = require('./db/connection')
const UserRouter = require('./routes/user_route')
const adminRouter = require("./routes/admin_routes")
const swaggerjsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const { errorHandler, noFound } = require("./middleware/errorhandler")
const bodyParser = require('body-parser');
const { IsAuth } = require("./middleware/auth")
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs');



app.use(cookieParser());
app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Api Documentation",
            version: "1.0.0",
            description: "Documentation for the API"
        },
        servers: [
            {
                url: "http://localhost:5500"
            }
        ]
    },
    apis: ["./routes/*.js"],
}
const spacs = swaggerjsdoc(options)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(spacs)
);

// Routes
app.get('/', (req, res) => {
    res.render("login", { message: "" })
})
app.get("/home", IsAuth, (req, res, next) => {
    res.render('bdd', { message: "" })
})
app.get('/home/administrators/profile', IsAuth, async (req, res, next) => {
    try {
        const admin_email = req.user_email
        const [exictinguser] = await db.query("select * from adminstation where  admin_email =? ", [admin_email])
        if (exictinguser.length === 0) {
            return res.status(409).render("login", { message: 'user not found' })
        }
        const profile = exictinguser[0]
        return res.render("admin_profile", { profile  })
    } catch (error) {
        console.log(error);
        return res.render('login', { message: error.message })

    }
})

app.get("/home/students/create", IsAuth, (req, res, next) => {
    res.render("add_student", { message: "" })
})
app.get("/home/students/:id/update", IsAuth, async (req, res, next) => {
    try {
        const { id } = req.params
        //find the student in the database by his id and render a page to update it
        const [student] = await db.query(`SELECT * FROM students WHERE id= ?`, [id])
        if (student.length === 0) {
            return res.status(409).render("students", { message: "account not found " })
        }
        const data = student[0]

        const [groupe] = await db.query(`SELECT * FROM groupes WHERE groupe_id= ?`, [data.student_groupe])
        student_groupe = groupe[0].groupe_name
        const [dep] = await db.query(`SELECT * FROM departments WHERE departement_id = ?`, [data.student_departement])
        student_departement = dep[0].departement_name
        return res.render("update_student", { data, student_groupe, student_departement, message: "" })
    } catch (error) {
        console.log(error);
        return res.render('students', { message: error.message })
    }

})

app.get('/home/departments/:id/students', IsAuth, async (req, res, next) => {
    try {
        const { id } = req.params
        const [departement] = await db.query("select * from departments where  departement_id =? ", [id])
        if (departement.length === 0) {
            return res.status(409).redirect("/home/departements")
        }
        const [students] = await db.query("select * from students where  student_departement =? ", [id])
        return res.status(409).render("student_list", { students, message: '' })
    } catch (error) {
        console.log(error);
        return res.render('bdd', { message: error.message })
    }
})
app.get('/home/departments/:id/professors', IsAuth, async (req, res, next) => {
    try {
        const { id } = req.params
        const [departement] = await db.query("select * from departments where  departement_id =? ", [id])
        if (departement.length === 0) {
            return res.status(409).redirect("/home/departements")
        }
        const [professors] = await db.query("select * from professors where  professor_departement =? ", [id])
        return res.render('list_professors', { professors, message: "" })
    } catch (error) {
        console.log(error);
        return res.render('bdd', { message: error.message })
    }
})
app.get("/home/professors/:id/update", IsAuth, async (req, res, next) => {
    try {
        const { id } = req.params
        const [professor] = await db.query(`SELECT * FROM professors WHERE id= ?`, [id])
        if (professor.length === 0) {
            return res.status(409).render("professors", { message: "professor doesnt exicte" })
        }
        const data = professor[0]
        const [dep] = await db.query(`SELECT * FROM departments WHERE departement_id = ?`, [data.professor_departement])
        professor_departement = dep[0].departement_name
        return res.render("update_professor", { data, professor_departement, message: "" })
    } catch (error) {
        console.log(error);
        return res.render('professors', { message: error.message })
    }

})

app.get("/home/courses/create", IsAuth, (req, res, next) => {
    res.render("add_course" , {message :""})
})
app.get("/home/professors/create", IsAuth, (req, res, next) => {
    res.render("add_professor",{message :""})
})
app.get("/home/departements/create", IsAuth, (req, res, next) => {
    res.render("add_departement" , {message : ""})
})
app.get("/home/professors/:id/add_groupe", IsAuth, (req, res, next) => {
    const {id} = req.params
    res.render("add_groupe_prof" , {id, message : ""})
})
app.post("/home/professors/:id/add_groupe", IsAuth,async (req, res, next) => {
    const {id} = req.params
    const [professor] = await db.query("select * from professors where id = ? ",[id])
    if (professor.length === 0) {
        const [professors]= await db.query('select * from professors where 1')        
        return res.render("professors",{professors, message :"professor account doesnt exicte"})
    }
    const [departement] =await db.query("select * from departments where departement_id = ?",[ professor[0].professor_departement])
    const {groupe_name} = req.body
    const [groupe] = await db.query("select * from groupes where groupe_name = ? ", [groupe_name])
    if (groupe.length === 0) {
        return res.render("professor_profile",{
            professor: professor[0],
            departement:departement[0].departement_name ,
            message : "groupe doesnt exicte"
        })
    }
    const groupe_id = groupe[0].groupe_id
    const [groupe_prof] = await db.query("select * from prof_groups where groupe_id =? and professor_id =?",[groupe_id,id])
    if (groupe_prof.length !== 0) {
        return res.render("professor_profile",{
            message : "groupe already exist",
            professor: professor[0],
            departement:departement[0].departement_name 
        })
    }
    const prof_group = {
        professor_id : id,
        groupe_id 
    }
    await db.query("insert into prof_groups set ?", [prof_group])
    return res.redirect(`/home/professors/${id}/profile`)

})

app.get("/home/groupes/create", IsAuth, (req, res, next) => {
    res.render("add_groupe" , {message:""} )
})


app.use(UserRouter)
app.use(adminRouter)
app.use(noFound)
app.use(errorHandler)
app.listen(port, () => console.log(`Server running on port ${port}`))