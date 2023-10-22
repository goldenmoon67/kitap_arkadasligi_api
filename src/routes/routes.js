const express = require('express');
const router = express.Router()
const authRoutes=require("./auth-routes");
const adminRoutes=require("./admin-routes");
const authorRoutes=require("./author-routes");
const bookRoutes=require("./book-routes");
const directorRoutes=require("./director-routes");
const userRoutes= require("./user-routes");

router.use(authRoutes);
router.use(adminRoutes);
router.use(authorRoutes);
router.use(bookRoutes);
router.use(directorRoutes);
router.use(userRoutes);

module.exports = router;
