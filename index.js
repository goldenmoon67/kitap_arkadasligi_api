const express = require('express');
const bodyParser=require("body-parser");
const firebase=require("./src/utils/firebase-admin");
const routes = require('./src/routes/routes');
require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const i18next=require("i18next");
const Backend=require("i18next-fs-backend");
const middleware=require("i18next-http-middleware");
i18next.use(Backend).use(middleware.LanguageDetector).
init({
  fallbackLng:'en',
  backend:{
    loadPath:'./locales/{{lng}}/translation.json'
  }
})
//firebase, express and database init
firebase.initFirebaseAdmin();
const app = express();
app.use(middleware.handle(i18next));
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
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')) ;
app.use('/api', routes)
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data=error.data
    res.status(status).json({ message: message, data:data });
  });
//server run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Started at ${8080}`)
});