const database = require('../utils/database');
const dateUtil = require('../utils/date');
var crypto = require('crypto'); 

exports.getProducts = () => {
    try {
        const sql = `select * from product_master;`;
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

exports.addProduct = (body) => {
    try {
        console.log(body)
        var now = dateUtil.dateNow();
        console.log(now)
        const sql = `insert into product_master (product_title,product_description,product_thumbnail_url,product_price,product_price_type,product_created_by,product_created_on) 
        values(?,?,?,?,?,?,?);`;
        return database.execute(sql, [body.PRODUCT_TITLE, body.PRODUCT_DESCRIPTION,body.PRODUCT_THUMBNAIL_URL,body.PRODUCT_PRICE,body.PRODUCT_PRICE_TYPE,body.PRODUCT_CREATED_BY,now]).then(data => {
            console.log(data)
            if(data?.data?.affectedRows>0){
            return ({ 
                message : "Product Added Successfully..", 
            });
        }else{
            return ({ 
                message : "Error while adding product..", 
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
exports.deleteProduct = (body) => {
    try {
        console.log(body)
        var now = dateUtil.dateNow();
        console.log(now)
        const sql = `DELETE FROM product_master WHERE PRODUCT_ID=?;`;
        return database.execute(sql, [body.PRODUCT_ID]).then(data => {
            console.log(data)
            if(data?.data?.affectedRows>0){
            return ({ 
                message : "Product Deleted Successfully..", 
            });
        }else{
            return ({ 
                message : "Error while deleting product..", 
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
exports.updateProduct = (body) => {
    try {
        console.log(body)
        var now = dateUtil.dateNow();
        console.log(now)
        const sql = `update product_master set product_title=?, product_description=?,product_thumbnail_url=?,product_price=?,product_price_type=?,product_updated_by=?,product_updated_on=? where product_id=?;`;
        return database.execute(sql, [body.PRODUCT_TITLE, body.PRODUCT_DESCRIPTION,body.PRODUCT_THUMBNAIL_URL,body.PRODUCT_PRICE,body.PRODUCT_PRICE_TYPE,body.PRODUCT_UPDATED_BY,now,body.PRODUCT_ID]).then(data => {
            console.log(data)
            if(data?.data?.affectedRows>0){
            return ({ 
                message : "Product updated Successfully..", 
            });
        }else{
            return ({ 
                message : "Error while updated product..", 
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
exports.assignProduct = (body) => {
    try {
        //console.log(body.email)
        const pass="demo123"
        var now = dateUtil.dateNow();
        var passwordEnc =setPassword("pass");
        //console.log(now)
        const sqlUpdate =`insert into users (name,email,password,phone,role_id,created_at) 
        values(?,?,?,?,?,?);`;
         return database.execute(sqlUpdate, [body.first_name.concat(body.last_name),body.email,passwordEnc,body.phone,2,now]).then(data => {
            //return data;
            console.log(data)
            if(data?.data.affectedRows>0){
                console.log("In")
                var productId=getProductId("AER");
                const sql = `insert into user_product_master (user_role_id,user_product_id,is_active) values(?,?,?);`;
                 return database.execute(sql, [Number(data.data.insertId),Number(productId), 'Y']).then(data => {
                    console.log(data)
                    return ({ 
                        message : "Course alligned to user",
                        username:  body.email,
                        password:  pass
                    })
                }).catch(err => {
                    throw err;
                });
            }else{
                return ({ 
                    message : "User not created Successfully", 
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

var getProductId = function(code)
{
    console.log("product id" +code)
    const sql = `select product_id from product_master where product_code = ?;`;
        return database.execute(sql, [code]).then(data => {
            console.log(data);
            return data.data.product_id;
        }).catch(err => {
            throw err;
        });
}

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
