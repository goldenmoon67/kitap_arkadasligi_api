const firebase = require('firebase/app');
const consts = require("../../../consts/consts");
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

firebase.initializeApp(consts.firebaseConfigs);

exports.login = async (req, res) => {
    try {
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
        return res.status(200).json({ "accesToken": standardToken });

    } catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }

}; 