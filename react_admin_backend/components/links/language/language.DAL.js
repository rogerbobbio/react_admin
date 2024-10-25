const pool = require('../../../database/mysqlpool');

function createLanguage(description, user_create) {

    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {description};

            if (user_create)
              values = {description, user_create};

            var sql = 'INSERT INTO language SET ?';
          connection.query(sql, values, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function updateLanguage(languageId, req) {
    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                languageId
            ];
            var sql = 'UPDATE language SET ? WHERE id = ?';
          connection.query(sql, values, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function deleteLanguage(languageId) {

    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM language WHERE id = ?';
          connection.query(sql, languageId, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getAllLanguages() {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM language';
          connection.query(sql, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function searchLanguages(searchValue) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var value = '%' + searchValue + '%';
            var sql = 'SELECT * FROM language WHERE description like ?';
          connection.query(sql, value, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getLanguageInfo(description) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM language WHERE description = ?';
          connection.query(sql, description, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

function getLanguageInfoById(languageId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM language WHERE id = ?';
          connection.query(sql, languageId, ( err, rows) => {
           if ( err ) {
            reject( err )
           } else {
            resolve( rows )
           }
           connection.release()
          })
         }
        })
       })
}

module.exports = {
    createLanguage,
    updateLanguage,
    deleteLanguage,
    getAllLanguages,
    searchLanguages,
    getLanguageInfo,
    getLanguageInfoById
}