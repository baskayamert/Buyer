const express = require('express')
const User = require('../../models/User')
const router = express.Router()

router.get('/', (req, res) => {
    User.find({}).sort({ $natural: -1 }).lean().then(users => {
        res.render('admin/index', { users: users})
    })
})

router.delete('/:id', (req, res) => {
    User.deleteOne({ _id: req.params.id }).lean().then(users => {
        res.redirect('/admin')
    })
})

router.get('/users/edit/:id', (req, res) => {
    User.findOne({_id: req.params.id}).lean().then(user => {
        res.render('admin/editUser', {user: user})
    })
})

router.put('/users/edit/:id', (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, {$set:{
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }}).lean().then(user => {
        res.redirect('/admin')
    })
})

module.exports = router