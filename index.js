const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const ejsLayout = require("express-ejs-layouts")
const path = require("path")
const methodOverride = require("method-override")
require('dotenv').config()

// port 
const PORT = process.env.PORT || 3000

// routers
const articleRouter = require("./controller/article")

// EJS
app.use(ejsLayout)
app.set('view engine', 'ejs')

// parsing data
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// for static files
app.use('/public', express.static(path.join(__dirname, 'static')))

// setting method Override
app.use(methodOverride("_method"))


// mongo
require('./model/db')

// setting routers 
app.use('/article', articleRouter)

// welcome route
app.get('/', (req, res) => {
    res.render("welcome")
})

// server starting 
app.listen(PORT, (err) => {
    if(!err){
        console.log(`server started on port ${PORT}`)
    }
    else{
        console.log(err)
    }
})
