const mysql = require('mysql2');
const config = require('../config/databaseConfig');
const connectionPool = mysql.createPool(config).promise();

exports.execute = async (sql, params) => {
    try{
        const [rows, fields] = await connectionPool.execute(sql, [...params]);
        return {data: rows};
    } catch(err) {
        return {error: err};
    }
}