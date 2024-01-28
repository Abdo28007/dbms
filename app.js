const express = require('express')
const port = 5500
const app = express()
const db = require('./db/connection')
const UserRouter = require('./routes/user_route')
const adminRouter = require("./routes/admin_routes")
const swaggerjsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const {errorHandler , notFound} = require("./middleware/errorhandler")
const bodyParser = require('body-parser');
const isAuth = require("./middleware/auth")

app.set('view engine', 'ejs');




app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title:"Api Documentation",
            version:"1.0.0",
            description:"Documentation for the API"
        },
        servers:[
            {
                url:"http://localhost:5500"
            }
        ]
    },
    apis:["./routes/*.js"],
}
const spacs = swaggerjsdoc(options)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(spacs)
    );













// Routes
app.get('/', (req, res) => {
    res.render("login")
})
app.get("/home",(req,res) => {
    res.render('bdd')
})
app.get('/home/profile', (req,res) => {
    res.render("profile")
})



app.get("/home/students/create",(req,res) => {
    res.render("add_student")
})
app.get("/home/courses/create",(req,res) => {
    res.render("add_course")
})
app.get("/home/professors/create",(req,res) => {
    res.render("add_professor")
})
app.get("/home/departements/create",(req,res) => {
    res.render("add_departement")
})
app.get("/home/groupes/create",(req,res) => {
    res.render("add_groupe")
})


app.get("/home/students/:id/update",(req,res) => {
    res.render("update_student")
})
app.get("/home/courses/:id/update",(req,res) => {
    res.render("update_course")
})
app.get("/home/professors/:id/update",(req,res) => {
    res.render("update_professor")
})
app.get("/home/departements/:id/update",(req,res) => {
    res.render("update_departement")
})

app.get("/home/administrators/create",(req,res) => {
    res.render("add_admin")
})











app.use(UserRouter)
app.use(adminRouter)
app.use(notFound)
app.use(errorHandler)
app.listen(port, () => console.log(`Server running on port ${port}`))