const admin = require("firebase-admin");

const credentials = require("../../serviceAccountKey");


const initFirebaseAdmin=async ()=>{
 return await   admin.initializeApp({
        credential: admin.credential.cert(credentials),
    });

};
exports.initFirebaseAdmin=initFirebaseAdmin;
exports.admin=admin;