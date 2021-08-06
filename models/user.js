const database = require('../utils/database');
const dateUtil = require('../utils/date');

exports.checkDbValidToken = (token,login_id) => {
    try {
        const sql = 'select token_expire from users where remember_token=? and login_id = ?;';
        return database.execute(sql, [token,login_id]).then(data => {
            console.log(data)
            return data;
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}

exports.findOneByEmail = (email) => {
    try {
             const sql = `SELECT * FROM users users
                            join roles_master role
                            on users.role_id = role.id 
                            WHERE users.email = ?;`;
             return database.execute(sql, [email]).then(data => {
                 return data;
             }).catch(err => {
                 throw err;
             });
         } catch(e) {
             console.error(e)
             throw e;
         }
}

exports.updateToken = (login_id,secret, flag) => {
    try {
             const sql = 'update users set remember_token=?, token_expire=? WHERE login_id = ?;';
             return database.execute(sql, [secret,flag,login_id]).then(data => {
                 console.log(data)
                 return data;
             }).catch(err => {
                 throw err;
             });
         } catch(e) {
             console.error(e)
             throw e;
         }
}

exports.updatePasswordEmail = (name, email,secret) => {
    try {
             const sql = 'update users set password=? WHERE email = ? and name = ?;';
             return database.execute(sql, [secret,email, name]).then(data => {
                 return data;
             }).catch(err => {
                 throw err;
             });
         } catch(e) {
             console.error(e)
             throw e;
         }
}

exports.sendOtp = (email,otp) => {
    try {
        const sqlUpdate =`update user_otp_validation set validate_flag='Y' where email_id=?;`;
        return database.execute(sqlUpdate, [email]).then(data => {
            //return data;
            //console.log(data)
            var date = dateUtil.dateNow()
            const sql = `insert into user_otp_validation (email_id, otp, created_dt, validate_flag) 
            values(?,?,?,?);`;
            return database.execute(sql, [email,otp, date,"N"]).then(data => {
                console.log(data)
                return data;
            }).catch(err => {
                throw err;
            });
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}


exports.updatePasswordOtpEmail = (name, email, secret, otp) => {
    try {
        const sqlUpdate =`update user_otp_validation set validate_flag='Y'
        where email_id=? and otp=? and validate_flag='N';`;
        return database.execute(sqlUpdate, [email, otp]).then(data => {
            //return data;
            console.log(data)
            if(data?.data.changedRows>0){
                const sql = 'update users set password=? WHERE email = ? and name = ?;';
             return database.execute(sql, [secret,email, name]).then(data => {
                 return data;
             }).catch(err => {
                 throw err;
             });
            }
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}

exports.getRole = () => {
    try {
        const sql = `select * from roles;`;
        return database.execute(sql, []).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}

exports.addUser = (body, password, Otp) => {
    try {
        console.log(body.email)
        var now = dateUtil.dateNow();
        //console.log(now)
        const sqlUpdate =`update user_otp_validation set validate_flag='Y' where email_id=? and otp=? and validate_flag='N';`;
        return database.execute(sqlUpdate, [body.email, Otp]).then(data => {
            //return data;
            console.log(data)
            if(data?.data.changedRows>0){
                const sql = `insert into users (name, email, password, created_at, phone, website, date_of_birth, role_id, email_otp_verified) 
                values(?,?,?,?,?,?,?,?,?);`;
                return database.execute(sql, [body.name, body.email, password, now, body.phone, body.website, body.dob, body.roleId, 'N']).then(data => {
                    console.log(data)
                    if(data?.data?.affectedRows>0){
                        const sql = `update users set email_otp_verified='Y', login_id=?, updated_at=? where email=?;`;
                            return database.execute(sql, [10000+data.data.insertId, now, body.email])
                            .then(data => {
                                console.log(data)
                                return ({ 
                                    message : "User Added Successfully.. Please Login..", 
                                });
                            })
                    }else{
                        return ({ 
                            message : "User Already Exists or Contact with Technical team..", 
                        })
                    }
                    //return data;
                }).catch(err => {
                    throw err;
                });
            }else{
                return ({ 
                    message : "OTP Not Verified", 
                })
            }
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}

exports.insertEmailLog = (info, option) => {
    var now = dateUtil.dateNow()
    try {
        const sql = `insert email_notification (message_id, email_from, email_body, created_time, email_to, response)
        values (?,?,?,?,?,?);`;
        return database.execute(sql, [info.messageId, info.envelope.from,option.text , now, info.envelope.to[0], info.response]).then(data => {
            //console.log(data)
            return data;
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}

exports.insertEmailErrorLog = (option, info) => {
    var now = dateUtil.dateNow();
    try {
        const sql = `insert email_notification (error_code, response, email_from, email_body, created_time, email_to)
        values (?,?,?,?,?,?);`;
        return database.execute(sql, [info.code, info.response, option.from, option.text, now, option.to]).then(data => {
            //console.log(data)
            return data;
        }).catch(err => {
            throw err;
        });
    } catch(e) {
        console.error(e)
        throw e;
    }
}