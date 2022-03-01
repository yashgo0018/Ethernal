// config the dotenv
require('dotenv').config();


// import dependencies
const express = require('express');
const database = require('./database');
const User = require("./models/User");
const authRouter = require('./routes/auth');
const userRouter = require('./router/user');


// define the variables
const PORT = process.env.PORT || 3000;


// setup app
const app = express();
app.use(express.json());


// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// connect to database and start the server
database.authenticate().then(() => {
    console.log("Connection has been established successfully.")
    return database.sync();
}).catch(error => {
    console.error('Unable to connect to the database:', error)
}).then(() => {
    console.log("Synced models with database");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
