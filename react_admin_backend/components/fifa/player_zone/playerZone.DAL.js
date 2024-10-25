const pool = require('../../../database/mysqlpool');

function createPlayerZone(description, player_position_id, user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {description, player_position_id, user_create};
            var sql = 'INSERT INTO player_zone SET ?';
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

function updatePlayerZone(playerZoneId, req) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                playerZoneId
            ];
            var sql = 'UPDATE player_zone SET ? WHERE id = ?';
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

function deletePlayerZone(playerZoneId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM player_zone WHERE id = ?';
          connection.query(sql, playerZoneId, ( err, rows) => {
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

function getPlayerZoneByDescription(description) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM player_zone WHERE description = ?';
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

function getPlayerZonesByModuleId(playerPositionId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM player_zone '+
            ' WHERE player_position_id = ?';
          connection.query(sql, playerPositionId, ( err, rows) => {
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

function getPlayerZoneInfoById(playerZoneId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
                        '       c.description as player_position_description '+
                        ' FROM player_zone m   '+
                        ' JOIN player_position c ON c.id = m.player_position_id '+
                        ' WHERE m.id = ?';
          connection.query(sql, playerZoneId, ( err, rows) => {
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

function getAllPlayerZones() {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
                        '       c.description as player_position_description '+
                        ' FROM player_zone m   '+
                        ' JOIN player_position c ON c.id = m.player_position_id '+
                        ' ORDER BY m.player_position_id';
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

function searchPlayerZones(description, playerPositionId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql = 'SELECT m.*,  '+
                      '       c.description as player_position_description '+
                      ' FROM player_zone m   '+
                      ' JOIN player_position c ON c.id = m.player_position_id '+
                      ' WHERE 1=1 ';

                        if (title != '') {
                            var value = '%' + description + '%';
                            sql = sql + '   AND m.description like ?';
                            filters.push(value);
                        }
                        if (playerPositionId > 0) {
                            sql = sql + '   AND m.player_position_id = ?';
                            filters.push(playerPositionId);
                        }
                      
                      ' ORDER BY m.player_position_id';
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
    createPlayerZone,
    updatePlayerZone,
    deletePlayerZone,
    getPlayerZoneByDescription,
    getPlayerZonesByModuleId,
    getPlayerZoneInfoById,
    getAllPlayerZones,
    searchPlayerZones
}