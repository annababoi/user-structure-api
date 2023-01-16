const express = require('express');
const mongoose = require ('mongoose');

const { PORT, MONGO_URL } = require('./config/config');
const userRouter = require('./router/user.router')

mongoose.set('strictQuery', true);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRouter);

app.use((err, req, res, next) => {

    res.status(err.status || 500).json({
        message: err.message || 'Unknown error',
        status: err.status || 500
    })
});

app.listen(PORT, async () => {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Listen port ${PORT}`);
})