const express = require('express');
const Model = require('../models/model');
const firebase = require("../utils/firebase-admin");

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
        console.log("Registered succesfly" + userResponse);
        res.status(200).json(userResponse);

    } catch (error) {


        res.status(400).json({message:error});
        console.log(error);
    }

});


module.exports = router;