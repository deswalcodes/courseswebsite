require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit');
const ratelimiter = rateLimit({
    windowMs : 15*60*1000,
    max : 100,
    message : {
        error : "too many requests"
    },
    
});
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const { userModel } = require('./db');
app.use(ratelimiter);
const app = express();
app.use(express.json());
const cron = require('node-cron');
cron.schedule('0 0 * * *',async () => {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear()-1);
    try{
        await userModel.updateMany({},
            {
                $pull : {
                    purchasedCourses : {
                        purchaseDate : {$lt : expirationDate}
                    }
                }
            }
        );
        console.log('Expired courses removed')
    }
    catch(err){
        console.log('error removing the expired courses')
    }
    
})



app.use('/user',userRouter);
app.use('/course',courseRouter);
app.use('/admin',adminRouter);
mongoose.connect(process.env.MONG)


app.listen(3002);

