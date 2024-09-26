const express = require('express');
const Router = express.Router;
const userRouter = Router();


userRouter.post('/signup',function(req,res){


})

userRouter.post('/signin',function(req,res){

})


userRouter.get('/purchases',function(req,res){
    
});

module.exports = {
    userRouter : userRouter
}