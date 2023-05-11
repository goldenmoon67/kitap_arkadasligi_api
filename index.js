const express = require('express');
const firebase=require("./utils/firebase-admin");
const database=require("./utils/database");
const routes = require('./routes/routes');

//firebase, express and database init
firebase.initFirebaseAdmin();
database.connectDatabase;
const app = express();


//express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes)

//server run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Started at ${8080}`)
})