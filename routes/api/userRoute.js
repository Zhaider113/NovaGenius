const express = require('express');
const UserController = require('../../controller/api/userController');
var verifyToken = require('../../middleware/auth/verifyToken');
const router = new express.Router();

const api_url = '/api/v1/user'

// Update user Password 
router.post(`${api_url}/password-update`,verifyToken, UserController.updatePassword);
// Proifile Updation/completion 
router.get(`${api_url}/logout`,verifyToken, UserController.logout);

module.exports = router