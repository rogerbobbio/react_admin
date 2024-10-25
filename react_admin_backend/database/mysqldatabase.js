const mysql = require('mysql');


//Local
/*  module.exports = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'admin_pro_react',
});  */


// Nube
module.exports = mysql.createPool({
    host: 'mysql-rbobbio.alwaysdata.net',
    port: '3306',
    user: 'rbobbio',
    password: 'malacas',
    database: 'rbobbio_adminpro',
}); 