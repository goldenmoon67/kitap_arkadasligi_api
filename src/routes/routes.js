const express = require('express');
const router = express.Router()
const authRoutes=require("./auth-routes");
const userRoutes=require("./user-routes");
const authorRoutes=require("./author-routes");
const directorRoutes=require("./director-routes");
const bookRoutes=require("./book-routes");

//AUTH
router.use(authRoutes);
//USER
router.use(userRoutes);
//BOOK
router.use(bookRoutes);
//AUTHOR
router.use(authorRoutes);
//DIRECTOR
router.use(directorRoutes);



module.exports = router;
