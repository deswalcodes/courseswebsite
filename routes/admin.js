const express = require('express');
const Router = express.Router;
const adminRouter = Router();

const {adminModel} = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET_ADMIN = 'djvbsdhkbvksjdjhs'
const bcrypt = require('bcrypt');
const { z } =require('zod');

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

adminRouter.post('/course',function(req,res){


});

adminRouter.put('/course',function(req,res){

});

adminRouter.get('/bulk',function(req,res){

});








module.exports = {
 adminRouter : adminRouter
}