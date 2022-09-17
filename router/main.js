const express = require('express')
const Category = require('../models/Category')
const Product = require('../models/Product')
const router = express.Router()

router.get('/', (req, res) => {
    Category.find({}).sort({name: 1}).lean().then(categories => {
        Product.find({}).lean().then(products => {
            res.render('site/index', {categories: categories, products: products})
        })
        
    })
    
})

router.get('/category/:categoryId', (req, res) => {
    Product.find({category:req.params.categoryId}).populate({path:'category', model:Category}).lean().then(products => {
        Category.find({}).sort({name: 1}).lean().then(categories => {
            res.render('site/index', {categories: categories, products: products})
        })
    })
})

module.exports = router