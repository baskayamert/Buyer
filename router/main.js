const express = require('express')
const Category = require('../models/Category')
const router = express.Router()

router.get('/', (req, res) => {
    Category.find({}).sort({name: 1}).lean().then(categories => {
        res.render('site/index', {categories: categories})
    })
    
})

module.exports = router