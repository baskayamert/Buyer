const express = require('express')
const router = express.Router()

router.get('/register', (req, res) => {
    res.render('site/register')
})

router.post('/register', (req, res) => {
    req.session.sessionFlash = {
        type:'alert alert-success',
        message: 'You have registered successfully'
    }
    res.redirect('/users/login')
})

router.get('/login', (req, res) => {
    res.render('site/login')
})

module.exports = router