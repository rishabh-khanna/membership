const express = require('express');


const productController = require('../controllers/product')

const Router = express.Router();

Router.get('/getProducts', productController.productController);
Router.post('/addProduct', productController.addProductController);
Router.post('/deleteProduct', productController.deleteProductController);
Router.post('/updateProduct', productController.updateProductController);
Router.post('/assignProduct', productController.assignProductController);

  
module.exports = Router;