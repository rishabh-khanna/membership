const express = require('express');


const userController = require('../controllers/user')

const Router = express.Router();

Router.post('/login', userController.loginUserController);
Router.post('/setPassword', userController.setUserPassController);
Router.post('/logout', userController.logoutController);
Router.post('/otpGen', userController.otpController);
Router.get('/getRole', userController.roleController);
Router.post('/addUser', userController.addUserController);
  
module.exports = Router;
