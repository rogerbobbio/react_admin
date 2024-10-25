pool = require('../database/mysqldatabase');

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('MySQL DB connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('MySQL DB has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('MySQL DB connection was refused.')
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('MySQL DB connection was denied.')
        }
    } else {
        console.log('DataBase run on host: ' + connection.config.host);
        console.log('DataBase run on port: ' + connection.config.port);
        console.log('DataBase name: ' + connection.config.database);
        console.log('MySQL DB is connected');
    }    
    return
});

module.exports = pool;