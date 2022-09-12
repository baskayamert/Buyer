const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    admin: {type: Schema.Types.ObjectId, ref: 'users'},
    price: {type: Number, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'categories'},
    product_image: {type: String, required:true, unique: true},
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Product', ProductSchema)