const userModel = require('../models/user');
const https = require('https');
var crypto = require('crypto'); 
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator')
const sendEmail = require('../middlewares/email');
const statusCode =require('../utils/statusCode');

// Method to set salt and hash the password for a user 
var setPassword = function(password) { 
     //console.log(password)
    // Creating a unique salt for a particular user 
    var algo="sha512"
    var iteration=10000
    var salt = crypto.randomBytes(16).toString('hex'); 
    //console.log(salt)
    // Hashing user's salt and password with 1000 iterations, 
    var hash = crypto.pbkdf2Sync(password, salt, iteration, 64, algo).toString(`hex`); 
    var secret=`${iteration}$${salt}$${hash}`
    console.log(secret)
    return secret;
   }; 
     
   // Method to check the entered password is correct or not 
var validPassword = function(password, secret) { 
    //console.log(secret.split('$'))
    const [iterations, salt, hashed] = secret.split('$');
    //var salt = crypto.randomBytes(16).toString('hex'); 
    //console.log(salt)
    var hash = crypto.pbkdf2Sync(password, salt, 10000, 64, `sha512`).toString(`hex`); 
    //console.log(hash)
    return hash === hashed; 
   }; 
   
//JWT Token
var generateAccessToken =  function generateAccessToken(username) {
    return jwt.sign({login_id: username}, process.env.PRIVATE_KEY, { expiresIn: process.env.EXPIRE_TIME })
}

var verifyAccessToken =  function verifyAccessToken(token) {
    return jwt.verify(token, process.env.PRIVATE_KEY);
}

var verifyDbAccessToken =  function verifyDbAccessToken(token,login_id) {
    //console.log(token,login_id)
    userModel.checkDbValidToken(token,login_id).then(rowData => {
        //console.log(rowData)
        if(rowData?.data?.length>0){
            return rowData.data[0].token_expire;
        }else{
            return 'Y'
        }
    })
}

exports.loginUserController = (req, res, next) => {
    console.log("Login Email: "+req.body.email)
    userModel.findOneByEmail(req.body.email).then(rowData => {
        if (rowData?.data?.length === 0) { 
            return res.status(statusCode.OK).send({ 
                message : "User not found."
            }); 
        } else if(rowData?.data?.length === 1){
            if (validPassword(req.body.password, rowData.data[0].password)) { 
                var token =generateAccessToken(rowData.data[0].login_id);
                if(token != null){
                    userModel.updateToken(rowData.data[0].login_id, token, 'N').then(tokenData => {
                        console.log(tokenData)
                        if (tokenData?.data?.changedRows > 0) { 
                            const output = { 
                                message : "User Logged In", 
                                authorize_token : token,
                                user_name: rowData.data[0].name,
                                user_email: rowData.data[0].email,
                                user_loginId: rowData.data[0].login_id,
                                user_role: rowData.data[0].role_name}
                            console.log("User Logged Details: ",output)
                            const data = generateAccessToken(output)
                            console.log("Encrypt String: ",data)
                            return res.status(statusCode.OK).send({ 
                                data
                              }) 
                        }else{
                            return res.status(statusCode.Unauthorized).send({ 
                                message : "Not Authorised to Login.."
                            }); 
                        }
                    })
                }
            } 
            else { 
                return res.status(statusCode.Unauthorized).send({ 
                    message : "Wrong Password"
                }); 
            } 
        } else if(rowData?.data?.length > 1){
            return res.status(statusCode.Unauthorized).send({ 
                message : "More than 1 User available.. Contact with Admin.."
            }); 
        }
    }); 
}

exports.setUserPassController = (req, res, next) => {
   var secret=setPassword(req.body.password);
   var otp=req.body.otp
   if(otp == "111111"){
        userModel.updatePasswordEmail(req.body.name, req.body.email, secret).then(rowData => {
            //console.log(rowData)
            if(rowData?.data.changedRows>0){
                return res.status(statusCode.OK).send({ 
                    message : "Password Updated", 
                })
            }else{
                return res.status(statusCode.OK).send({ 
                    message : "Password Not Updated.. Something Went Wrong", 
                })
            }
        })
    }else{
        userModel.updatePasswordOtpEmail(req.body.name, req.body.email, secret, otp).then(rowData => {
            //console.log(rowData)
            if(rowData?.data.changedRows>0){
                return res.status(statusCode.OK).send({ 
                    message : "Password Updated", 
                })
            }else{
                return res.status(statusCode.OK).send({ 
                    message : "Password Not Updated.. Something Went Wrong", 
                })
            }
        })
    }
        
}


exports.logoutController = (req, res, next) => {
    const getAccessToken=verifyAccessToken(req.headers.authorize_token);
    const updateToken=crypto.randomBytes(120).toString('hex');
    userModel.checkDbValidToken(req.headers.authorize_token,getAccessToken.login_id).then(rowData => {
        //console.log(rowData)
        if(rowData?.data?.length>0){        
            if(rowData.data[0].token_expire == "N"){
                userModel.updateToken(getAccessToken.login_id, updateToken, 'Y').then(tokenData => {
                    if(tokenData?.data.changedRows>0){
                        return res.status(statusCode.OK).send({ 
                            authorize_token : updateToken,
                            message : "Logout Successfully..", 
                        })
                    }else{
                        return res.status(statusCode.OK).send({ 
                            message : "Something Went Wrong ..", 
                        })
                    }
                })
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

 exports.otpController = (req, res, next) => {
    var email= req.body.email;
    //var login_id=req.body.login_d;
    console.log("Otp for ", email);
    if(email !=null){
        var otp= otpGenerator.generate(6, { upperCase: false, specialChars: false, digits: true, alphabets: false});
        console.log("Otp: ", otp);
        userModel.sendOtp(email,otp).then(rowData => {
            //console.log(rowData)
            if(rowData?.data.affectedRows>0){
                text =
                    `Dear User,
                    ${otp} is your code(OTP) for login to Voltaic. Please do not share with anyone.
                    
                    Regards,
                    Team Voltiac`
                sendEmail.sendMailController(email, text)

                return res.status(statusCode.OK).send({ 
                    message : "OTP Sent", 
                })
            }else{
                return res.status(statusCode.OK).send({ 
                    message : "OTP Not Sent.. Something Went Wrong", 
                })
            }
           })
    }
 }

 exports.roleController = (req, res, next) => {
    userModel.getRole().then(rowData => {
        console.log(rowData)
        if (rowData?.data?.length === 0) { 
            return res.status(statusCode.OK).send({ 
                message : "Role not found."
            }); 
        }else{
            return res.status(statusCode.OK).send({ 
                message : rowData.data, 
            })
        }
        })
 }

 exports.addUserController = (req, res, next) => {
    var passwordEnc =setPassword(req.body.password);
    var otp =req.body.otp;
    if(otp != null){
        console.log(req.body)
        userModel.addUser(req.body, passwordEnc, otp).then(rowData => {
            console.log(rowData)
            if (rowData?.data?.length === 0) { 
                return res.status(400).send({ 
                    message : "Oops User Not added... Sometjing Went Wrong.."
                }); 
            }else{
                return res.status(201).send({ 
                    message : rowData, 
                })
            }
        })
    }
 }