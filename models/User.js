const mongoose = require ("mongoose")
const Schema = mongoose.Schema


const userSchema = Schema({
    name: {type: String, required: true}, 
    avatar: {type: String, required: true}, 
    email: {type: String, required: true}, 
    password: {type: String, required: true}, 
    isDeleted: {type: Boolean, default: false}, 
    role: {type: String, enum:["admin", "guest"], default: "guest"}
}, 
{
    timestamps: true,
})

const User = mongoose.model("User", userSchema)
module.exports = User