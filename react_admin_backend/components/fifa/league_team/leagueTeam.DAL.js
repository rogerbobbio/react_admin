const pool = require('../../../database/mysqlpool');

function createLeagueTeam(name, league_id, user_create) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = {name, league_id, user_create};
            var sql = 'INSERT INTO league_team SET ?';
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

function updateLeagueTeam(leagueTeamId, req) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var values = [
                req.body,
                leagueTeamId
            ];
            var sql = 'UPDATE league_team SET ? WHERE id = ?';
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

function deleteLeagueTeam(leagueTeamId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'DELETE FROM league_team WHERE id = ?';
          connection.query(sql, leagueTeamId, ( err, rows) => {
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

function getLeagueTeamByName(name) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM league_team WHERE name = ?';
          connection.query(sql, name, ( err, rows) => {
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

function getLeagueTeamsByLeagueId(leagueId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT * FROM league_team '+
            ' WHERE league_id = ?'+
            ' ORDER BY name';
          connection.query(sql, leagueId, ( err, rows) => {
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

function getLeagueTeamInfoById(leagueTeamId) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
                        '       c.name as league_name '+
                        ' FROM league_team m   '+
                        ' JOIN league c ON c.id = m.league_id '+
                        ' WHERE m.id = ?';
          connection.query(sql, leagueTeamId, ( err, rows) => {
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

function getAllLeagueTeams() {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var sql = 'SELECT m.*,  '+
                        '       c.name as league_name '+
                        ' FROM league_team m   '+
                        ' JOIN league c ON c.id = m.league_id '+
                        ' ORDER BY m.name';
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

function searchLeagueTeams(name, leagueId) {    
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
         if (err) {
          reject( err )
         } else {
            var filters = [];
            var sql = 'SELECT m.*,  '+
                      '       c.name as league_name '+
                      ' FROM league_team m   '+
                      ' JOIN league c ON c.id = m.league_id  '+
                      ' WHERE 1=1 ';

                        if (name != '') {
                            var value = '%' + name + '%';
                            sql = sql + '   AND m.name like ?';
                            filters.push(value);
                        }
                        if (leagueId > 0) {
                            sql = sql + '   AND m.league_id = ?';
                            filters.push(leagueId);
                        }
                      
                        sql = sql + ' ORDER BY m.name';          
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
    createLeagueTeam,
    updateLeagueTeam,
    deleteLeagueTeam,
    getLeagueTeamByName,
    getLeagueTeamsByLeagueId,
    getLeagueTeamInfoById,
    getAllLeagueTeams,
    searchLeagueTeams
}