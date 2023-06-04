const express = require('express');
const firebase=require("./src/utils/firebase-admin");
const routes = require('./src/routes/routes');
require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
//firebase, express and database init
firebase.initFirebaseAdmin();
const app = express();


//database connection
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});

//express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes)

//server run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Started at ${8080}`)
});