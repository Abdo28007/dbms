const express = require('express')
const port = 5500
const app = express()
const connection = require('./db/connection')

  
app.listen(port, () => console.log(`Server running on port ${port}`))

// Express setup
app.use(express.json()) // for parsing application/json

// Routes
app.get('/', (req, res) => {
    res.send('Hello ya wlid el 97ba!')
})
