const firebase = require('firebase/app');
const consts = require("../../../consts/consts");
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { validationResult } = require('express-validator');


firebase.initializeApp(consts.firebaseConfigs);

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error =  new Error(req.t("validation-failed"));
            error.data=errors.array();
            error.statusCode = 422;
            throw error;
        }
        const { email, password } = req.body;
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const data = userCredential._tokenResponse
        const standardToken = {
            accessToken: data.idToken,
            expiresIn: parseInt(data.expiresIn),
            refreshToken: data.refreshToken,
            userId: data.localId,

        }
        return res.status(201).json(standardToken);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}; 