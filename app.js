const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

// Connect to mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://timertracker:AbderrahmeneDZ@ds237120.mlab.com:37120/timertracker')

// Load Routes
const auth = require('./routes/auth')
const data = require('./routes/data')

const app = express()


app.use(cors())

app.get('/', (req, res) => {
    res.send('It works, yeah sure, please use api')
})

// Get Data from body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Use Routes
app.use('/api/auth', auth)
app.use('/api/data', data)

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`server started on port ${port}`)
})