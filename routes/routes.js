const express = require('express');
const Model = require('../models/model');
const firebase = require("../utils/firebase-admin");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require('dotenv').config();
const sendgridString = process.env.SENDGRID_API_KEY;

const transporter = nodemailer.createTransport(sendgridTransport(
    {
        auth: {
            api_key: sendgridString,
        }
    }
));
const router = express.Router()

router.post('/create', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        email: req.body.email
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});


router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})




router.post('/register', async (req, res) => {
    try {
        const userResponse = await firebase.admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            emailVerified: false,
            disabled: false
        });

        const data = new Model({
            userId:userResponse.uid,
            name: req.body.name,
            email: req.body.email,
            age:req.body.age
        });
        const dataToSave = await data.save();
        res.status(200).json({ databaseResponse: dataToSave, firebaseResponse: userResponse });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

});

router.post('/sendMail', async (req, res) => {
    try {
        const email = req.body.email;
        const response = await transporter.sendMail({
            to: email,
            from: "mirac@z2h.it",
            subject: "Succes",
            html: "<h1> Succes </h1>"
        });

        if (response) {
            res.status(200).json({ message: "email was sent", response: response });
            console.log(response);
        } else {
            res.status(400).json({ message: error });
            console.log(error);
        }
    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

});


module.exports = router;
