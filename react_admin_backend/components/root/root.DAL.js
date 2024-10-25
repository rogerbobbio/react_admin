const pool = require('../../database/mysqlpool');

function testConnection() {
    return new Promise(
        function(res, rej) {
            pool.query(
                'SELECT 1 as value',
                function(err, rows, field) {
                    if(err) rej(err);
                    res(rows);
                });
        }
    )
}

module.exports = {
    testConnection
}