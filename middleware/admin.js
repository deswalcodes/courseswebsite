const jwt = require('jsonwebtoken')
const { JWT_SECRET_ADMIN } = require('../config')


function adminMiddleware(req,res,next){
    const token = req.headers.token;
    const verifyT = jwt.verify(token,JWT_SECRET_ADMIN);
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
    adminMiddleware : adminMiddleware
}