require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const admin = require("firebase-admin");
const credentials = require("./serviceAccountKey.json");
const routes = require('./routes/routes');

const mongoString = process.env.DATABASE_URL;
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/register', async (req, res) => {

    const userResponse = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    });

    res.json(userResponse);
});



app.use('/api', routes)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Started at ${8080}`)
})