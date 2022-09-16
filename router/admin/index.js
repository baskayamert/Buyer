const express = require('express')
const path = require('path')
const User = require('../../models/User')
const Category = require('../../models/Category')
const Product = require('../../models/Product')
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
    Category.find({}).sort({ name: 1 }).lean().then(categories => {
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

router.get('/categories/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id}).lean().then(category => {
        res.render('admin/editCategory', {category: category})
    })
    
})

router.put('/categories/edit/:id', (req, res) => {
    const {name} = req.body
    Category.findOneAndUpdate({ _id: req.params.id }, {$set:{
        name: name
    }}).lean().then(category => {
        res.redirect('/admin/categories')
    })
})

//Products

router.get('/products', (req, res) => {
    Product.find({}).populate({path:'admin', model: User}).populate({path:'category', model:Category}).lean().then(products => {
        res.render('admin/products', {products: products})  
    })
})

router.delete('/products/:id', (req, res) => {
    Product.deleteOne({_id: req.params.id}).lean().then(product => {
        res.redirect('/admin/products')
    })
})

router.get('/products/edit/:id', (req, res) => {
    Product.findOne({_id: req.params.id}).populate({path:'admin', model: User}).populate({path:'category', model:Category}).lean().then(product => {
        Category.find({}).lean().then(categories => {
            res.render('admin/editProduct', {product: product, categories: categories}) 
        })  
    })
})

router.put('/products/edit/:id', (req, res) => {
    const {name, price, category} = req.body
    let product_image =  req.files.product_image
    product_image.mv(path.resolve(__dirname, '../../public/img/productImages', product_image.name))
    Product.findByIdAndUpdate({_id: req.params.id}, {$set:{
        name: name,
        price: price,
        category: category,
        product_image: `/img/productImages/${product_image.name}`
    }}).lean().then(product => {    
        res.redirect('/admin/products') 
    })
})

router.get('/products/addNewProduct', (req, res) => {
    Category.find({}).lean().then(categories => {
        res.render('admin/addNewProduct', {categories: categories})
    })
})

router.post('/products/addNewProduct', (req, res) => {
    let product_image = req.files.product_image

    product_image.mv(path.resolve(__dirname, '../../public/img/productImages', product_image.name))

    Product.create({
        ...req.body,
        product_image: `/img/productImages/${product_image.name}`,
        admin: req.session.userId
    },)

    req.session.sessionFlash = {
        type:'alert alert-success',
        message: 'The product has been successfully added!'
    }

    res.redirect('/admin/products')

})

module.exports = router