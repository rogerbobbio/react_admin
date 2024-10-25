const pool = require('../../database/mysqlpool');

function createUser(userName, email, firstName, lastName, password, role_id, img, user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {userName, email, firstName, lastName, password, role_id, img};

            if (user_create)
              values = {userName, email, firstName, lastName, password, role_id, img, user_create};
            
            var sql = 'INSERT INTO system_user SET ?';
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

function logAction(action, user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {action, user_create};
            
            var sql = 'INSERT INTO system_loggin SET ?';

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

function updateUser(userId, req) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                userId
            ];
            var sql = 'UPDATE system_user SET ? WHERE id = ?';
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

function deleteUser(userId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM system_user WHERE id = ?';
          connection.query(sql, userId, ( err, rows) => {
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

function getUserInfoByUserName(userName) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM system_user WHERE userName = ?';
          connection.query(sql, userName, ( err, rows) => {
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

function getUserInfoById(userId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT u.*, r.description as role_name '+
            '  FROM system_user u'+
            '  JOIN user_role r ON u.role_id = r.id'+
            ' WHERE u.id = ?';
          connection.query(sql, userId, ( err, rows) => {
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

function getUserInfoByEmail(email) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM system_user WHERE email = ?';
          connection.query(sql, email, ( err, rows) => {
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

function getAllUsers() {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT u.*, r.description as role_name '+
            '  FROM system_user u'+
            '  JOIN user_role r ON u.role_id = r.id';
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

function searchUsers(searchValue) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var value = '%' + searchValue + '%';
            var sql = 'SELECT u.*, r.description as role_name '+
                      '  FROM system_user u'+
                      '  JOIN user_role r ON u.role_id = r.id'+
                      ' WHERE u.userName like ? OR u.email like ?';
          connection.query(sql, [value, value], ( err, rows) => {
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

function getUserMenu(roleId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT sm.title AS module_description, sm.icon,'+
            '       ss.order_no, ss.title, ss.url'+
            '  FROM system_screen ss'+
            '  JOIN system_module sm on sm.id = ss.module_id'+
            '  JOIN system_permission sp on sp.screen_id = ss.id'+
            ' WHERE sp.role_id = ?'+
            ' ORDER BY sm.order_no, ss.order_no';
          connection.query(sql, roleId, ( err, rows) => {
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
    getUserInfoByUserName,
    getAllUsers,
    createUser,
    getUserInfoByEmail,
    updateUser,
    getUserInfoById,
    deleteUser,
    searchUsers,
    getUserMenu,
    logAction
}