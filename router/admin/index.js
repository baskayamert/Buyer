const express = require('express')
const User = require('../../models/User')
const Category = require('../../models/Category')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index')
})

//Users

router.get('/users', (req, res) => {
    User.find({}).sort({ $natural: -1 }).lean().then(users => {
        res.render('admin/users', { users: users})
    })
})

router.delete('/users/:id', (req, res) => {
    User.deleteOne({ _id: req.params.id }).lean().then(users => {
        res.redirect('/admin/users')
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
        res.redirect('/admin/users')
    })
})

//Categories

router.get('/categories', (req, res) => {
    Category.find({}).sort({ $natural: -1 }).lean().then(categories => {
        res.render('admin/categories', {categories:categories})
    })
})

router.post('/categories', (req, res) => {
    Category.create(req.body, (error, category) => {
        if(!error){
            req.session.sessionFlash = {
                type:'alert alert-success',
                message: 'The category has been successfully added!'
            }
            res.redirect('/admin/categories')
        }
    })
})

router.delete('/categories/:id', (req, res) => {
    Category.deleteOne({ _id: req.params.id }).lean().then(categories => {
        res.redirect('/admin/categories')
    })
})

module.exports = router