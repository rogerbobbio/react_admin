const pool = require('../../../database/mysqlpool');

function createPlayer(name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
                      country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
                      datetime_deleted, order_number, user_create) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
                          country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
                          datetime_deleted, order_number, user_create};
            var sql = 'INSERT INTO player SET ?';
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

function updatePlayer(playerId, req) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                playerId
            ];
            var sql = 'UPDATE player SET ? WHERE id = ?';
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

function deletePlayer(playerId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM player WHERE id = ?';
          connection.query(sql, playerId, ( err, rows) => {
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

function getPlayerByName(name, playerVersionId, countryId, leagueTeamId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM player WHERE name = ? AND player_version_id = ? AND country_id = ? AND league_team_id = ?';
          connection.query(sql, [name, playerVersionId, countryId, leagueTeamId], ( err, rows) => {
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

function getPlayerInfoById(playerId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT p.*,  '+
            '       l.name as league_name, '+
            '       t.name as league_team_name, '+
            '       v.description as player_version_description, '+
            '       z.description as player_zone_description, '+
            '       s.description as player_position_description, '+ 
            '       c.name as country_name '+
            ' FROM player p   '+
            ' JOIN league l ON l.id = p.league_id '+
            ' JOIN league_team t ON t.id = p.league_team_id '+
            ' JOIN player_version v ON v.id = p.player_version_id '+
            ' JOIN player_zone z ON z.id = p.player_zone_id '+
            ' JOIN country c ON c.id = p.country_id '+
            'JOIN player_position s ON s.id = p.player_position_id '+
            ' WHERE p.id = ?';
          connection.query(sql, playerId, ( err, rows) => {
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

function getAllPlayers() {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT p.*,  '+
            '       l.name as league_name, '+
            '       t.name as league_team_name, '+
            '       v.description as player_version_description, '+
            '       z.description as player_zone_description, '+
            '       s.description as player_position_description, '+ 
            '       c.name as country_name '+
            ' FROM player p   '+
            ' JOIN league l ON l.id = p.league_id '+
            ' JOIN league_team t ON t.id = p.league_team_id '+
            ' JOIN player_version v ON v.id = p.player_version_id '+
            ' JOIN player_zone z ON z.id = p.player_zone_id '+
            ' JOIN country c ON c.id = p.country_id '+
            ' JOIN player_position s ON s.id = p.player_position_id '+
            ' ORDER BY p.rating desc, p.order_number, p.name';
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

function getAllPlayersDuplicate() {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT name, order_number, rating FROM player WHERE duplicate = 1 ORDER BY rating desc, order_number';
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

function searchPlayers(searchValue) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var value = '%' + searchValue + '%';
            var sql = 'SELECT p.*,  '+
                        '       l.name as league_name, '+
                        '       t.name as league_team_name, '+
                        '       v.description as player_version_description, '+
                        '       z.description as player_zone_description, '+
                        '       s.description as player_position_description, '+ 
                        '       c.name as country_name '+
                        ' FROM player p   '+
                        ' JOIN league l ON l.id = p.league_id '+
                        ' JOIN league_team t ON t.id = p.league_team_id '+
                        ' JOIN player_version v ON v.id = p.player_version_id '+
                        ' JOIN player_zone z ON z.id = p.player_zone_id '+
                        ' JOIN country c ON c.id = p.country_id '+
                        ' JOIN player_position s ON s.id = p.player_position_id '+
                      ' WHERE p.name like ?'+
                      ' ORDER BY p.rating desc, p.order_number, p.name';
          connection.query(sql, [value], ( err, rows) => {
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

function searchPlayersByParameters(name, playerPositionId, playerZoneId, playerVersionId, leagueTeamId, leagueId, 
                                   countryId, rating, playerType, duplicate, playerSeleted, orderBy, duplicateTimes) {

    //console.log(playerSeleted)

    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql = 'SELECT p.*,  '+
                        '       l.name as league_name, '+
                        '       t.name as league_team_name, '+
                        '       v.description as player_version_description, '+
                        '       z.description as player_zone_description, '+
                        '       s.description as player_position_description, '+ 
                        '       c.name as country_name '+
                        ' FROM player p   '+
                        ' JOIN league l ON l.id = p.league_id '+
                        ' JOIN league_team t ON t.id = p.league_team_id '+
                        ' JOIN player_version v ON v.id = p.player_version_id '+
                        ' JOIN player_zone z ON z.id = p.player_zone_id '+
                        ' JOIN country c ON c.id = p.country_id '+
                        ' JOIN player_position s ON s.id = p.player_position_id '+
                        ' WHERE 1=1 ';
                        if (name != '') {
                            var value = '%' + name + '%';
                            sql = sql + '   AND p.name like ?';
                            filters.push(value);
                        }
                        
                        if (playerPositionId > 0) {
                            sql = sql + '   AND p.player_position_id = ? ';
                            filters.push(playerPositionId);
                        }

                        if (playerZoneId > 0) {
                            sql = sql + '   AND p.player_zone_id = ? ';
                            filters.push(playerZoneId);
                        }
                        if (playerVersionId > 0) {
                            sql = sql + '   AND p.player_version_id = ?';
                            filters.push(playerVersionId);
                        }
                        if (leagueTeamId > 0) {
                            sql = sql + '   AND p.league_team_id =?';
                            filters.push(leagueTeamId);
                        }
                        if (leagueId > 0) {
                            sql = sql + '   AND p.league_id =?';
                            filters.push(leagueId);
                        }
                        if (countryId > 0) {
                            sql = sql + '   AND p.country_id =?';
                            filters.push(countryId);
                        }
                        if (rating > 0) {
                            sql = sql + '   AND p.rating =?';
                            filters.push(rating);
                        }
                        if (playerType != '') {
                            var value = '%' + playerType + '%';
                            sql = sql + '   AND p.player_type like ?';
                            filters.push(value);
                        }
                        if (duplicateTimes != '') {
                            sql = sql + '   AND p.duplicate_times =?';
                            filters.push(duplicateTimes);
                        }
                        if (duplicate < 3) {
                            sql = sql + '   AND p.duplicate =?';
                            filters.push(duplicate);
                        }
                        if (playerSeleted < 3) {
                            sql = sql + '   AND p.player_seleted =?';
                            filters.push(playerSeleted);
                        }
   
                        sql = sql + ' ORDER BY p.rating desc, p.order_number, p.name';
                        //console.log(sql);
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
    createPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerByName,
    getPlayerInfoById,
    getAllPlayers,
    searchPlayers,
    searchPlayersByParameters,
    getAllPlayersDuplicate
}