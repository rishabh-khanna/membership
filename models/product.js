const database = require('../utils/database');
const dateUtil = require('../utils/date');

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
        console.log(body)
        var now = dateUtil.dateNow();
        console.log(now)
        const sql = `;`;
        return database.execute(sql, []).then(data => {
            console.log(data)
            if(data?.data?.affectedRows>0){
            return ({ 
                message : "Product assigned Successfully to user..", 
            });
        }else{
            return ({ 
                message : "Error while assigning product..", 
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
