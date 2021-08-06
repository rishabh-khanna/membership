const express = require('express');


const contactsController = require('../controllers/contacts')

const Router = express.Router();

Router.post('/getContacts', contactsController.getContactsController);
Router.post('/addModifyContacts', contactsController.insertContactsController);
  
module.exports = Router;
