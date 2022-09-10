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

module.exports = router