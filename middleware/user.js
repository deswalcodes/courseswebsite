const jwt = require('jsonwebtoken')
const { JWT_SECRET_USER } = require('../config')


function userMiddleware(req,res,next){
    const token = req.headers.token;
    const verifyT = jwt.verify(token,JWT_SECRET_USER);
    if(verifyT){
        req.userId = verifyT.id;
        next()
    }
    else{
        res.json({
            message : "you are not signed in"
        })
    }


}




module.exports = {
    userMiddleware : userMiddleware
}