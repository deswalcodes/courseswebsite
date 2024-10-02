require('dotenv').config()

const express = require('express');
const { z } = require('zod');
const Router = express.Router;
const bcrypt = require('bcrypt');
const userRouter = Router();
const { userMiddleware } = require('../middleware/user.js')

const {userModel, courseModel}  = require('../db');
const jwt = require('jsonwebtoken')
const {JWT_SECRET_USER} = require('../config.js');
const user = require('../middleware/user.js');




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
userRouter.post('/purchase',userMiddleware,async function(req,res){
    const userId = req.userId;
    const courseId  = req.body.courseId;
    try{
        const response = await userModel.findOneAndUpdate({
            _id : userId
        },{
            $addToSet : {
                purchasedCourses : {
                    courseId : courseId,
                    status : false
                }
                
                
            }
        },{new : true})
        if(!response){
            return res.status(400).json({
                message : "course not found"
            })
        }
        res.status(200).json({
            message : "purchase successfull"
        })
    }
    catch(err){
        res.status(500).json({
            message : "error accessing the database"
        })
    }
})
userRouter.post('/statuschange',userMiddleware,async function(req,res){
    const userId = req.userId;
    const courseId = req.body;
    try{
        const response = await userModel.findOneAndUpdate({
            _id : userId,
            'purchasedCourses.courseId' : courseId
        },{
            $set : {
                'purchasedCourses.$.status' : true
            }
        },{new : true})
    }
    catch(err){
        res.status(500).json({
            message : "error accessing the database"
        })
    }
})

userRouter.get('/purchases/preview',userMiddleware,async function(req,res){
    const userId = req.userId;
    const response = await userModel.findById(userId).populate('purchasedCourses');
    res.json({
        purchases : response.purchasedCourses
    })



    
});
userRouter.get('/allcourses',async function(req,res){
    const response = await courseModel.find({
        archive : false
    });
    res.json({
        ActiveCourses : response
    })
})

userRouter.get('/productivity',userMiddleware,async function(req,res){
    const userId = req.userId;
    try{
        const response = await userModel.aggregate([
            {$match : {_id : userId}},
            {
                $project : {
                    completeCount : {
                        $size : {
                            $filter : {
                                input : '$purchasedCourses',
                                as : 'course',
                                cond : {$eq : ['$$course.status',true]}
                            }
                        }
                    },
                    notComplete : {
                        $size : {
                            $filter : {
                                input : '$purchasedCourses',
                                as : 'course',
                                cond : {$eq : ['$$course.status',false]}
                            }
                        }
                    }
                
                }
            }
           ]);
           
           if(response.length > 0){
            const completed = response[0].completeCount;
            const notCompleted = response[0].notComplete;
            const UserProductivity = (completed/(completed + notCompleted))*100
           };
           res.status(200).json({
            Productivity : UserProductivity
           })
           
    }
    catch(err){
        res.status(500).json({
            message : 'error accessing the database'
        })
    }
})
module.exports = {
    userRouter : userRouter
}