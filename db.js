const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://21cs2014:PjqThuLa8aIQYfhg@cluster0.x4o0n.mongodb.net/courses-database")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name : String,
    email : {type : String,unique : True},
    password : String
})
const adminSchema  = new Schema({
    name : String,
    email : {type : String,unique : True},
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
