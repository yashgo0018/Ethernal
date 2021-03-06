// config the dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: "../.env" });
}

// import dependencies
const express = require('express');
const database = require('./database');
const User = require("./models/User");
const Donation = require('./models/Donation');
const Post = require('./models/Post');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const donationsRouter = require('./routes/donations');
const postsRouter = require('./routes/post');
const web3listener = require('./web3listener');


// define the variables
const PORT = process.env.PORT || 3000;


// setup app
const app = express();
app.use(express.json());


// define the model relationships
User.hasMany(Donation);
Donation.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);


// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postsRouter);
app.use('/donations', donationsRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// connect to database and start the server
database.authenticate().then(() => {
    console.log("Connection has been established successfully.")
    return database.sync({ force: true });
}).then(() => {
    console.log("Synced models with database");
    web3listener();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error)
});
