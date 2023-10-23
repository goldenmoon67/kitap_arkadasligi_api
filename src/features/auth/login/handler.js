
const fb = require("../../../utils/firebase-admin")


exports.authenticate = async (req, res, next) => {

    try {
        var token;
        const idToken = req.headers.authorization
        if (!idToken) {
            const error = new Error(req.t('bearer-token-is-not-auth'));
            error.statusCode = 401;
            throw error;
        }
        token = idToken.split(" ")[1];
        const decodedToken = await fb.admin.app().auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (err) {
        const message=req.t('bearer-token-is-not-auth');
        err.message=message;
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }



}

