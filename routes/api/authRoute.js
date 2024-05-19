const express = require('express');
const AuthController = require('../../controller/api/authController');
const router = new express.Router();

const api_url = '/api/v1/auth'

/// add User route
router.post(`${api_url}/signup`, AuthController.Register_User);
// login user route
router.post(`${api_url}/login`, AuthController.Login_User);


module.exports = router