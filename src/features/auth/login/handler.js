
const fb = require("../../../utils/firebase-admin")


exports.authenticate = async (req, res, next) => {
    var token;
    const idToken = req.headers.authorization
    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        token= idToken.split(" ")[1];
        const decodedToken = await fb.admin.app().auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ error: error });

    }



}

