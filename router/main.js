const express = require('express')
const Category = require('../models/Category')
const Product = require('../models/Product')
const User = require('../models/User')
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

router.get('/product/:productId', (req, res) => {
    Product.findOne({_id:req.params.productId}).lean().then(product => {
        res.render('site/getProductById', {product: product})
    })
})

router.get('/cart/:userId', (req, res) => {
    User.findOne({_id: req.params.userId}).populate({path: 'cart', model: Product}).lean().then(user => {
        let totalAmount = 0

        let productsInCart = []

        user.cart.forEach(product => {
            let isProductExist
            for(product2 of productsInCart){
                if(product2.product._id === product._id) {
                    isProductExist = true
                    product2.quantity += 1
                    break
                }
            }

            if(!isProductExist){
                productsInCart.push({
                    product: product,
                    quantity: 1
                })
            }

            totalAmount += product.price
        })
        totalAmount = parseFloat(totalAmount).toFixed(2)

        res.render('site/cart', {user: user, totalAmount: totalAmount, productsInCart: productsInCart})
    })
})

router.put('/cart/:userId', (req, res) => {
    User.findOneAndUpdate({_id: req.params.userId}, { $push: {
        cart: req.body.productId
    }}).lean().then(user => {
        res.redirect(`/product/${req.body.productId}`)
    })
})

module.exports = router