require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
const { purchaseModel,courseModel } = require('../db')
const express = require('express');
const Router = express.Router;
const courseRouter = Router();
const { userMiddleware } = require('../middleware/user')

courseRouter.get('/preview',async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        courses
    })
    
})
courseRouter.post('/purchase',userMiddleware,async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;
    await purchaseModel.create({
        userId,
        courseId
    });
    res.json({
        message : "success"
    })

    
})

module.exports = {
    courseRouter : courseRouter
}