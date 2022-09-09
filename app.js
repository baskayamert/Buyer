const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')

const app = express()

const port = 3001
const hostname = '127.0.0.1'

app.use(expressSession({
    secret: 'hiddenkeyhiddenkey',
    resave: 'false',
    saveUninitialized: true
}))

app.use(express.static('public'))

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Flash Message Middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

// Router
const main = require('./router/main')
const users = require('./router/users')

app.use('/', main)
app.use('/users', users)

app.listen(port, hostname, () => console.log(`The server works correctly, http://${hostname}:${port}`))