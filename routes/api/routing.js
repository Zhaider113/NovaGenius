const express = require('express');
const AuthRoute = require('./authRoute');
const UserRoute = require('./userRoute');
const ProductRoute = require('./productRoute');

const router = new express.Router();

router.use(AuthRoute);
router.use(UserRoute);
router.use(ProductRoute);

module.exports = router;