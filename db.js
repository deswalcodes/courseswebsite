require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect("process.env.MONGO_URL")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name : String,
    email : {type : String,unique : true},
    password : String
})
const adminSchema  = new Schema({
    name : String,
    email : {type : String,unique : true},
    password : String
})

const courseSchema = new Schema({
    title  : String,
    description : String,
    price  : Number,
    imageURL : String,
    creatorId : ObjectId


})

const purchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId,


})

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}
