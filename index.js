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
app.use(ratelimiter);
const app = express();
app.use(express.json());

const mongoose = require('mongoose')
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
app.use('/user',userRouter);
app.use('/course',courseRouter);
app.use('/admin',adminRouter);
mongoose.connect(process.env.MONG)


app.listen(3002);

