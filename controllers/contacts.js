const contactsModel = require('../models/contacts');
const https = require('https');
var crypto = require('crypto'); 
const jwt = require('jsonwebtoken');
const sendEmail = require('../middlewares/email');
const statusCode =require('../utils/statusCode');

//JWT Token
var verifyAccessToken =  function verifyAccessToken(token) {
    return jwt.verify(token, process.env.PRIVATE_KEY);
}



exports.getContactsController = (req, res, next) => {
    const getAccessToken=verifyAccessToken(req.headers.authorize_token);
    const role = req.body.role;
    contactsModel.checkDbValidToken(req.headers.authorize_token,getAccessToken.login_id).then(rowData => {
        //console.log(rowData)
        if(rowData?.data?.length>0){        
            if(rowData.data[0].token_expire == "N"){
                if(getAccessToken.login_id!=null){
                    console.log("Login Of: ",getAccessToken.login_id)
                    //console.log(role)
                    if(role == "admin"){
                        contactsModel.getContactsAdmin().then(rowData => {
                            console.log(rowData)
                            if (rowData?.data?.length === 0) { 
                                return res.status(statusCode.OK).send({ 
                                    message : "No Record Found.."
                                }); 
                            } else{
                                return res.status(statusCode.OK).send({ 
                                    message : rowData.data
                                }) 
                            } 
                        }); 
                    }else{
                        contactsModel.getContactsByOwner(getAccessToken.login_id).then(rowData => {
                            //console.log(rowData)
                            if (rowData?.data?.length === 0) { 
                                return res.status(statusCode.OK).send({ 
                                    message : "No Record Found.."
                                }); 
                            } else{
                                return res.status(statusCode.OK).send({ 
                                    message : rowData.data
                                }) 
                            } 
                        });
                    }
                }else{
                    return res.status(statusCode.Unauthorized).send({ 
                        message : "Token Expired Please Login Again.."
                    }); 
                }
            }else{
                return res.status(statusCode.Unauthorized).send({ 
                    message : "Invalid Session", 
                })
            }
        }else{
            return res.status(statusCode.Unauthorized).send({ 
                message : "Invalid Access", 
            })
        }
    })   
}




exports.insertContactsController = (req, res, next) => {
    const getAccessToken=verifyAccessToken(req.headers.authorize_token);
    const role = req.body.role;
    contactsModel.checkDbValidToken(req.headers.authorize_token,getAccessToken.login_id).then(rowData => {
        //console.log(rowData)
        if(rowData?.data?.length>0){        
            if(rowData.data[0].token_expire == "N"){
                if(getAccessToken.login_id!=null){
                    console.log("Login Of: ",getAccessToken.login_id)
                    if(role == "admin"){
                        if(req.body.Contact_ID == null){
                            contactsModel.insertContactsByAdmin(getAccessToken.login_id, req.body).then(rowData => {
                                //console.log(rowData)
                                if (rowData?.data?.affectedRows > 0) {
                                    return res.status(statusCode.OK).send({ 
                                        message : "Contact Inserted.."
                                    }) 
                                } else{
                                    return res.status(statusCode.OK).send({ 
                                        message : "No Record Inserted.."
                                    });
                                } 
                            });
                        }else{
                            contactsModel.modifyContactsByAdmin(getAccessToken.login_id, req.body).then(rowData => {
                                //console.log(rowData)
                                if (rowData?.data?.affectedRows > 0) { 
                                    return res.status(statusCode.OK).send({ 
                                        message : "Contact Modified.."
                                    }) 
                                } else{
                                    return res.status(statusCode.OK).send({ 
                                        message : "No Record Modified.."
                                    });
                                } 
                            });
                        }

                    }else{
                        if(req.body.Contact_ID == null){
                            contactsModel.insertContactsByOwner(getAccessToken.login_id, req.body).then(rowData => {
                                //console.log(rowData)
                                if (rowData?.data?.affectedRows > 0) { 
                                    return res.status(statusCode.OK).send({ 
                                        message : "Contact Inserted.."
                                    }) 
                                } else{
                                    return res.status(statusCode.OK).send({ 
                                        message : "No Record Inserted.."
                                    }); 
                                } 
                            });
                        }else{
                            contactsModel.modifyContactsByOwner(getAccessToken.login_id, req.body).then(rowData => {
                                //console.log(rowData)
                                if (rowData?.data?.affectedRows > 0) { 
                                    return res.status(statusCode.OK).send({ 
                                        message : "Contact Modified.."
                                    }) 
                                } else{
                                    return res.status(statusCode.OK).send({ 
                                        message : "No Record Modified.."
                                    }); 
                                } 
                            });
                        }
                    }
                }else{
                    return res.status(statusCode.Unauthorized).send({ 
                        message : "Token Expired Please Login Again.."
                    }); 
                }
            }else{
                return res.status(statusCode.Unauthorized).send({ 
                    message : "Invalid Session", 
                })
            }
        }else{
            return res.status(statusCode.Unauthorized).send({ 
                message : "Invalid Access", 
            })
        }
    })   
}


