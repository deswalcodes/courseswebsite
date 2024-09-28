require('dotenv').config()

const express = require('express');
const { z } = require('zod');
const Router = express.Router;
const bcrypt = require('bcrypt');
const userRouter = Router();
const { userMiddleware } = require('../middleware/user.js')

const {userModel, purchaseModel, courseModel}  = require('../db');
const jwt = require('jsonwebtoken')
const {JWT_SECRET_USER} = require('../config.js')




userRouter.post('/signup',async function(req,res){
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
        await userModel.create({
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

    


})

userRouter.post('/signin',async function(req,res){
    const { email,password } = req.body;
    try{
        const response = await userModel.findOne({
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
        },JWT_SECRET_USER);
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

})


userRouter.get('/purchases',userMiddleware,async function(req,res){
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId
    });

    const coursesData = await courseModel.find({
        _id : {$in : purchases.map(x => x.courseId)}
    });
    res.json({
        purchases,
        coursesData
    });


    
});

module.exports = {
    userRouter : userRouter
}