require('dotenv').config()

const express = require('express');
const Router = express.Router;
const adminRouter = Router();

const {adminModel, courseModel} = require('../db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_ADMIN } = require('../config')
const bcrypt = require('bcrypt');
const { z } =require('zod');
const { adminMiddleware } = require('../middleware/admin.js');
const admin = require('../middleware/admin.js');

adminRouter.post('/signup',async function(req,res){
    

    const { name,email,password } = req.body;
    const zodobj = z.object({
        name : z.string().min(5).max(19),
        email : z.string().email(),
        password : z.string().min(8).max(16)
        
    })
    const safeP = zodobj.safeParse(req.body);
    if(!safeP){
        res.status(400).json({
            message : "invalid input",
            error : safeP.error
        })
        return
    }
    try{
        const hashedP = await bcrypt.hash(password,5);
        await adminModel.create({
            name :name,
            email:email,
            password:hashedP
        });
        res.json({
            message : "signup done"
        })
    }
    catch(err){
        res.status(500).json({
            message : "signup failed"
        })
    }




});

adminRouter.post('/signin',async function(req,res){
    const { email,password } = req.body;
    try{
        const response = await adminModel.findOne({
            email 
        });
        if(!response){
            res.status(404).json({
                message : "user doesnt exist"
            })
            return
        }
        const compareP = bcrypt.compare(password,response.password);
        if(!compareP){
            res.status(400).json({
                message : "incorrect password"
            })
            return
        }
        const token = jwt.sign({
            id : response._id.toString()
        },JWT_SECRET_ADMIN);
        res.json({
            token : token,
            message : "you are signed up"
        })

    }
    catch(err){
        res.status(505).json({
            message : "error accessing the database"
        })
    }

});

adminRouter.post('/course',adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const {title,description,imageURL,price} = req.body;
    const course = await adminModel.create({
        title,
        description,
        imageURL,
        price,
        creatorId : adminId,
        

    });
    res.json({
        message : "course created",
        courseId : course._id
    })




});

adminRouter.put('/course',adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const { title,description,imageURL,price,courseId } = req.body;
    const course = await courseModel.update({
        _id : courseId,
        creatorId : adminId

    },{
        title : title,
        description : description,
        imageURL : imageURL,
        price : price
    })



});

adminRouter.get('/activecourses',adminMiddleware,async function(req,res){
    const adminId =req.adminId;
    const courses = await courseModel.find({
        creatorId : adminId,
        archive : false
    })
    res.json({
        courses
        
    });



});
adminRouter.post('/archive',adminMiddleware,async function(req,res){
    const adminId = req.adminId;
    const courseId = req.body.courseId;
    try{
        const response = await courseModel.findOneAndUpdate({
            creatorId : adminId,
            _id : courseId
        },{
            $set : {
                archive : true
            }
        },{new : true});
        if(!response){
            res.status(400).json({
                message : "course not found"
            })
        }
        
    
    }
    catch(err){
        res.status(500).json({
            message : "error accessing the database"
        })
    }
})


adminRouter.get('/archivedcourses',adminMiddleware,async function(req,res){
    const adminId = req.adminId;
    try{
        const courses = await courseModel.find({
            creatorId : adminId,
            archive : true
        });
        if(courses.length === 0){
            return res.json({
                message : "no archived courses found"
            })
        }
        res.status(200).json({
            Archived_Courses : courses
        })

    }
    catch(err){
        res.status(500).json({
            message : "error accessing the database"
        })
    }
})









module.exports = {
 adminRouter : adminRouter
}