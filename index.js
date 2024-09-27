const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose')
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
app.use('/user',userRouter);
app.use('/course',courseRouter);
app.use('/admin',adminRouter);
mongoose.connect('mongodb+srv://21cs2014:PjqThuLa8aIQYfhg@cluster0.x4o0n.mongodb.net/courses-database')


app.listen(3002);

