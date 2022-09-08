const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const port = 3001
const hostname = '127.0.0.1'

app.use(express.static('public'))

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


// Router
const main = require('./router/main')
const users = require('./router/users')

app.use('/', main)
app.use('/users', users)

app.listen(port, hostname, () => console.log(`The server works correctly, http://${hostname}:${port}`))