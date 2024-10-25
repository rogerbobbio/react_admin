const dataAccess = require('./root.DAL');

function testConnection() {
    return dataAccess.testConnection()
        .then(function(rows) {
            return (rows[0].value);
        })
}

module.exports = {
    testConnection
}