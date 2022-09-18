const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const mongoose = require('mongoose')
const methodOvverride = require('method-override')

const app = express()

const port = 3001
const hostname = '127.0.0.1'

mongoose.connect('mongodb://127.0.0.1/ecommerce_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(expressSession({
    secret: 'hiddenkeyhiddenkey',
    resave: 'false',
    saveUninitialized: true,
    store: connectMongo.create({ mongoUrl: 'mongodb://127.0.0.1/ecommerce_db' })
}))

// It gives access to req.files
app.use(fileUpload())

app.use(express.static('public'))

app.use(methodOvverride('_method'))

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// The middleware which determines what is shown to users
app.use((req, res, next) => {
    const { userId } = req.session
    if(userId) {
        res.locals = {
            displayLink: true,
            userId: userId
        }
    } else {
        res.locals = {
            displayLink: false
        }
    }
    next()
})

// Flash Message Middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

// Router
const main = require('./router/main')
const users = require('./router/users')
const admin = require('./router/admin/index')

app.use('/', main)
app.use('/users', users)
app.use('/admin', admin)

app.listen(port, hostname, () => console.log(`The server works correctly, http://${hostname}:${port}`))