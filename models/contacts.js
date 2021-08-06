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

exports.getContactsAdmin = () => {
    try {
        const sql = `SELECT contacts.*, users.name as ownerName, users.email as ownerEmail, users.phone as ownerPhone, users.login_id as ownerLoginId 
                FROM contacts contacts
                inner join users users
                on contacts.Contact_Owner_ID = users.id;`;
        return database.execute(sql, []).then(data => {
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

exports.getContactsByOwner = (login_id) => {
    try {
        const sql = `SELECT contacts.*, users.name as ownerName, users.email as ownerEmail, 
                users.phone as ownerPhone, users.login_id as ownerLoginId 
                FROM contacts contacts
                inner join users users
                on contacts.Contact_Owner_ID = users.id
                and users.login_id=?;`;
        return database.execute(sql, [login_id]).then(data => {
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


exports.insertContactsByOwner = (login_id, body) => {
    var now = dateUtil.dateNow()
    try {
        const sql = `INSERT INTO contacts(Contact_Owner,Contact_Owner_ID,Lead_Source,First_Name,Last_Name,Email,Phone,Created_By,
            Created_Time,Mailing_Street,Mailing_City,Mailing_State,Mailing_Zip, Description,Salutation,Last_Activity_Time,Tag,
            Average_Bill,Date_Created,Energy_Consultant,Marketer,DateTime_Scheduled,
            Spouse_Name,Qualified_By,Home_Sq_Ft,Second_Marketer,Freedom_ID,LeadIdCPY) 
            VALUES ((select email from users where login_id=?),(select id from users where login_id=?),?,?,?,?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,?,?,?,?,?);`;
        return database.execute(sql, [login_id, login_id, body.Lead_Source, body.First_Name, body.Last_Name,
            body.Email, body.Phone, login_id, now, body.Mailing_Street, body.Mailing_City, body.Mailing_State, body.Mailing_Zip,
            body.Description, body.Salutation, body.Last_Activity_Time, body.Tag, body.Average_Bill, body.Date_Created, 
            body.Energy_Consultant, body.Marketer, body.DateTime_Scheduled, body.Spouse_Name, body.Qualified_By, body.Home_Sq_Ft,
            body.Second_Marketer, body.Freedom_ID, body.LeadIdCPY
        ]).then(data => {
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

exports.modifyContactsByOwner = (login_id, body) => {
    var now = dateUtil.dateNow()
    try {
        const sql = `UPDATE contacts set Lead_Source=?,First_Name=?,Last_Name=?,Email=?,Phone=?,Modified_By=?, Modified_Time=?,
            Mailing_Street=?,Mailing_City=?,Mailing_State=?,Mailing_Zip=?, Description=?,Salutation=?,Last_Activity_Time=?,Tag=?,
            Average_Bill=?,Energy_Consultant=?,Marketer=?,DateTime_Scheduled=?,
            Spouse_Name=?,Qualified_By=?,Home_Sq_Ft=?,Second_Marketer=?,Freedom_ID=?,LeadIdCPY=? where Contact_ID=?;`;
        return database.execute(sql, [body.Lead_Source, body.First_Name, body.Last_Name,
            body.Email, body.Phone, login_id, now, body.Mailing_Street, body.Mailing_City, body.Mailing_State, body.Mailing_Zip,
            body.Description, body.Salutation, body.Last_Activity_Time, body.Tag, body.Average_Bill, 
            body.Energy_Consultant, body.Marketer, body.DateTime_Scheduled, body.Spouse_Name, body.Qualified_By, body.Home_Sq_Ft,
            body.Second_Marketer, body.Freedom_ID, body.LeadIdCPY, body.Contact_ID
        ]).then(data => {
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


exports.insertContactsByAdmin = (login_id, body) => {
    var now = dateUtil.dateNow()
    try {
        const sql = `INSERT INTO contacts(Contact_Owner,Contact_Owner_ID,Lead_Source,First_Name,Last_Name,Email,Phone,Created_By,
            Created_Time,Mailing_Street,Mailing_City,Mailing_State,Mailing_Zip, Description,Salutation,Last_Activity_Time,Tag,
            Average_Bill,Date_Created,Energy_Consultant,Marketer,DateTime_Scheduled,
            Spouse_Name,Qualified_By,Home_Sq_Ft,Second_Marketer,Freedom_ID,LeadIdCPY) 
            VALUES ((select email from master_lead_owner where login_id=?),?,?,?,?,?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,?,?,?,?,?);`;
        return database.execute(sql, [body.owner_login_id, body.owner_login_id, body.Lead_Source, body.First_Name, body.Last_Name,
            body.Email, body.Phone, login_id, now, body.Mailing_Street, body.Mailing_City, body.Mailing_State, body.Mailing_Zip,
            body.Description, body.Salutation, now, body.Tag, body.Average_Bill, body.Date_Created, 
            body.Energy_Consultant, body.Marketer, body.DateTime_Scheduled, body.Spouse_Name, body.Qualified_By, body.Home_Sq_Ft,
            body.Second_Marketer, body.Freedom_ID, body.LeadIdCPY
        ]).then(data => {
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

exports.modifyContactsByAdmin = (login_id, body) => {
    var now = dateUtil.dateNow()
    try {
        const sql = `UPDATE contacts set Contact_Owner=(select email from master_lead_owner where login_id=?),
            Contact_Owner_ID=?,Lead_Source=?,First_Name=?,Last_Name=?,Email=?,Phone=?,
            Modified_By=?, Modified_Time=?, Mailing_Street=?,Mailing_City=?,Mailing_State=?,Mailing_Zip=?, Description=?,Salutation=?,
            Last_Activity_Time=?,Tag=?, Average_Bill=?,Energy_Consultant=?,Marketer=?,DateTime_Scheduled=?,
            Spouse_Name=?,Qualified_By=?,Home_Sq_Ft=?,Second_Marketer=?,Freedom_ID=?,LeadIdCPY=? where Contact_ID=?;`;
        return database.execute(sql, [body.owner_login_id, body.owner_login_id,body.Lead_Source, body.First_Name, body.Last_Name,
            body.Email, body.Phone, login_id, now, body.Mailing_Street, body.Mailing_City, body.Mailing_State, body.Mailing_Zip,
            body.Description, body.Salutation, now, body.Tag, body.Average_Bill, 
            body.Energy_Consultant, body.Marketer, body.DateTime_Scheduled, body.Spouse_Name, body.Qualified_By, body.Home_Sq_Ft,
            body.Second_Marketer, body.Freedom_ID, body.LeadIdCPY, body.Contact_ID
        ]).then(data => {
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

exports.getContactsAdmin = () => {
    try {
        const sql = `SELECT contacts.*, users.name as ownerName, users.email as ownerEmail, users.phone as ownerPhone, users.login_id as ownerLoginId 
                FROM contacts contacts
                inner join users users
                on contacts.Contact_Owner_ID = users.id;`;
        return database.execute(sql, []).then(data => {
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

