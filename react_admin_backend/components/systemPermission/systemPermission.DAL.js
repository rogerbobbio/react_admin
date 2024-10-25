const pool = require('../../database/mysqlpool');

function createPermission(role_id, module_id, screen_id,
                          access, created, edit,
                          deleted, especial1, especial2,
                          especial3, especial4, especial5, 
                          user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {role_id, module_id, screen_id,
                access, created, edit,
                deleted, especial1, especial2,
                especial3, especial4, especial5, 
                user_create};
            var sql = 'INSERT INTO system_permission SET ?';
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

function updatePermission(permissionId, req) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                permissionId
            ];
            var sql = 'UPDATE system_permission SET ? WHERE id = ?';
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

function deletePermission(permissionId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM system_permission WHERE id = ?';
          connection.query(sql, permissionId, ( err, rows) => {
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

function getPermissionByKey(role_id, module_id, screen_id) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM system_permission '+
                      'WHERE role_id = ? AND module_id = ?'+
                      '  AND screen_id =?';
          connection.query(sql, [role_id, module_id, screen_id], ( err, rows) => {
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

function getPermissionInfoById(permissionId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT p.*,  '+
            '       m.title as module_description, '+
            '       r.description as role_description, '+
            '       s.title as screen_title'+
            ' FROM system_permission p   '+
            ' JOIN system_module m ON m.id = p.module_id '+
            ' JOIN system_screen s ON s.id = p.screen_id '+
            ' JOIN user_role r ON r.id = p.role_id '+
            ' WHERE p.id = ?';
          connection.query(sql, permissionId, ( err, rows) => {
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

function getAllPermissions() {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT p.*,  '+
            '       m.title as module_description, '+
            '       r.description as role_description, '+
            '       s.title as screen_title'+
            ' FROM system_permission p   '+
            ' JOIN system_module m ON m.id = p.module_id '+
            ' JOIN system_screen s ON s.id = p.screen_id '+
            ' JOIN user_role r ON r.id = p.role_id '+
            ' ORDER BY r.id, m.id, s.id';
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

function getPermissionByScreen(title, role_id) {        
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT p.*,  '+
                      '       m.title as module_description, '+
                      '       r.description as role_description, '+
                      '       s.title as screen_title'+
                      ' FROM system_permission p   '+
                      ' JOIN system_module m ON m.id = p.module_id '+
                      ' JOIN system_screen s ON s.id = p.screen_id '+
                      ' JOIN user_role r ON r.id = p.role_id '+
                      ' WHERE s.url = ? AND r.id = ?';
          connection.query(sql, [title, role_id], ( err, rows) => {
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

function searchPermissions(roleId, moduleId, screenId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql =  'SELECT p.*,  '+
                        '       m.title as module_description, '+
                        '       r.description as role_description, '+
                        '       s.title as screen_title'+
                        ' FROM system_permission p   '+
                        ' JOIN system_module m ON m.id = p.module_id '+
                        ' JOIN system_screen s ON s.id = p.screen_id '+
                        ' JOIN user_role r ON r.id = p.role_id '+
                        ' WHERE 1=1 ';
                        if (roleId > 0) {
                            sql = sql + '   AND p.role_id = ? ';
                            filters.push(roleId);
                        }
                        if (moduleId > 0) {
                            sql = sql + '   AND p.module_id = ?';
                            filters.push(moduleId);
                        }
                        if (screenId > 0) {
                            sql = sql + '   AND p.screen_id =?';
                            filters.push(screenId);
                        }
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

function getSystemIndexByTable(tableName) {
    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            //var sql = 'SELECT * FROM system_index WHERE table_name = ?';
            var sql = 'CALL SPU_GET_SYSTEM_INDEX(?)';
          connection.query(sql, tableName, ( err, rows) => {
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
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionByKey,
    getPermissionInfoById,
    getAllPermissions,
    getPermissionByScreen,
    searchPermissions,
    getSystemIndexByTable
}