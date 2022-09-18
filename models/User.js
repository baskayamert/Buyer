const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cart: { type: [[Schema.Types.ObjectId]], ref: "products"}
})

module.exports = mongoose.model('User', UserSchema)