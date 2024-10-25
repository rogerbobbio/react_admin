const pool = require('../../database/mysqlpool');

function createScreen(title, url, order_no, module_id, user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {title, url, order_no, module_id, user_create};
            var sql = 'INSERT INTO system_screen SET ?';
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

function updateScreen(screenId, req) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                screenId
            ];
            var sql = 'UPDATE system_screen SET ? WHERE id = ?';
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

function deleteScreen(screenId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM system_screen WHERE id = ?';
          connection.query(sql, screenId, ( err, rows) => {
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

function getScreenByTitle(title) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM system_screen WHERE title = ?';
          connection.query(sql, title, ( err, rows) => {
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

function getScreensByModuleId(moduleId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM system_screen '+
            ' WHERE module_id = ?'+
            ' ORDER BY order_no';
          connection.query(sql, moduleId, ( err, rows) => {
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

function getScreenInfoById(screenId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
            '       c.title as module_description '+
            ' FROM system_screen m   '+
            ' JOIN system_module c ON c.id = m.module_id '+
            ' WHERE m.id = ?';
          connection.query(sql, screenId, ( err, rows) => {
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

function getAllScreens() {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
            '       c.title as module_description '+
            ' FROM system_screen m   '+
            ' JOIN system_module c ON c.id = m.module_id '+
            ' ORDER BY m.module_id, m.order_no';
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

function searchScreens(title, moduleId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql = 'SELECT m.*,  '+
                      '       c.title as module_description '+
                      ' FROM system_screen m   '+
                      ' JOIN system_module c ON c.id = m.module_id '+
                      ' WHERE 1=1 ';

                        if (title != '') {
                            var value = '%' + title + '%';
                            sql = sql + '   AND m.title like ?';
                            filters.push(value);
                        }
                        if (moduleId > 0) {
                            sql = sql + '   AND m.module_id = ?';
                            filters.push(moduleId);
                        }
                      
                      ' ORDER BY m.module_id, order_no';
          connection.query(sql, filters, ( err, rows) => {
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
    createScreen,
    updateScreen,
    deleteScreen,
    getScreenByTitle,
    getScreenInfoById,
    getAllScreens,
    searchScreens,
    getScreensByModuleId
}