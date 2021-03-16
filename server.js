require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

//App config
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//routes
app.use('/api', require('./routes/authRouter'))


//db config
const connection_url = 'mongodb+srv://social_app:ashu0111@cluster0.pknyk.mongodb.net/social_appdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})




//listener
app.listen(8001)

