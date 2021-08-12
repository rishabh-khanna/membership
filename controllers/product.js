const productModel = require('../models/product');
const https = require('https');
var crypto = require('crypto'); 
const statusCode =require('../utils/statusCode');



exports.productController = (req, res, next) => {
    productModel.getProducts().then(rowData => {
        console.log(rowData)
        if (rowData?.data?.length === 0) { 
            return res.status(statusCode.OK).send({ 
                message : "Product not found."
            }); 
        }else{
            return res.status(statusCode.OK).send({ 
                message : rowData.data, 
            })
        }
        })
 }

 exports.addProductController = (req, res, next) => {
       
        productModel.addProduct(req.body).then(rowData => {
            console.log(rowData)
            if (rowData?.data?.length === 0) { 
                return res.status(400).send({ 
                    message : "Oops Product Not added... Something Went Wrong.."
                }); 
            }else{
                return res.status(201).send({ 
                    message : rowData, 
                })
            }
        })
    
 }
 exports.deleteProductController = (req, res, next) => {
    productModel.deleteProduct(req.body).then(rowData => {
        console.log(rowData)
        if (rowData?.data?.length === 0) { 
            return res.status(400).send({ 
                message : "Oops Product Not deleted... Something Went Wrong.."
            }); 
        }else{
            return res.status(201).send({ 
                message : rowData, 
            })
        }
    })

}
exports.updateProductController = (req, res, next) => {
    productModel.updateProduct(req.body).then(rowData => {
        console.log(rowData)
        if (rowData?.data?.length === 0) { 
            return res.status(400).send({ 
                message : "Oops Product Not updated... Something Went Wrong.."
            }); 
        }else{
            return res.status(201).send({ 
                message : rowData, 
            })
        }
    })

}
exports.assignProductController = (req, res, next) => {
    productModel.assignProduct(req.body).then(rowData => {
        console.log(rowData)
        if (rowData?.data?.length === 0) { 
            return res.status(400).send({ 
                message : "Oops Product Not Assigned... Something Went Wrong.."
            }); 
        }else{
            return res.status(201).send({ 
                message : rowData, 
            })
        }
    })

}