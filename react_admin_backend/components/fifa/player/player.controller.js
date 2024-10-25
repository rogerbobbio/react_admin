/*
MYSQL Controller for Player
*/

var service = require('./player.service');

async function getPlayerInfo(req, res) {

    var playerId = req.params.id;    

    service.getPlayerInfoById(playerId)
    .then(function(player) {
      if(!player){
        return res.status(404).json({
          ok:false,
          msg: `Player Id ${playerId} was not found`
        });
      }
       
      res.send({
        ok: true,
        player
      });
    })
    .catch((err) => setImmediate(() => { 
      console.log(Date() + '\n' + err)
      res.status(err.status || 500).json({
        ok: false,
        value: err
      })
    }));
}

async function getAllPlayers(req, res) {

  service.getAllPlayers()
  .then(function(players) {

    const totalRecords = players.length;
         
    res.send({
      ok: true,
      totalRecords,
      players,      
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function getAllPlayersDuplicate(req, res) {

  service.getAllPlayersDuplicate()
  .then(function(players) {

    const totalRecords = players.length;
         
    res.send({
      ok: true,
      totalRecords,
      players,      
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function createPlayer(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  if (req.body.player_deleted === 1) {
    req.body.datetime_deleted = new Date();
  }

  const { name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
          country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
          datetime_deleted, order_number, user_create } = req.body;

  service.getPlayerByName(name, player_version_id, country_id, league_team_id)
  .then(function(player) {

      if (player === null) {        

        service.createPlayer(name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
                                country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
                                datetime_deleted, order_number, user_create)
        .then(function(player) {
              
          res.send({
            ok: true,
            playerId: player.insertId            
          });
        })
        .catch((err) => setImmediate(() => { 
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        }));

      } else  {
        return res.status(400).json({
            ok:false,
            msg: 'El nombre del jugador ya existe.'
        });
      }

  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function updatePlayer(req, res) {
  const uid = req.uid;
  req.body.user_update = uid;
  req.body.update_date = new Date();

  //console.log(req.body);

  var playerId = req.params.id;
  try {

    const player = await service.getPlayerInfoById(playerId);
        
    if(!player){
      return res.status(400).json({
          ok:false,
          msg: `Player Id ${playerId} was not found.`
      });
    } else {

      const { name, player_version_id, country_id, league_team_id } = req.body;
      
      var playerByName = null;

      if(player.name !== name) {
        playerByName = await service.getPlayerByName(name, player_version_id, country_id, league_team_id);
      }

      if (playerByName !== null) {
        return res.status(400).json({
            ok:false,
            msg: `Ya existe un jugador con ese nombre `
        });
      } else {

        if (req.body.player_deleted === 1) {
          req.body.datetime_deleted = new Date();
        } else {
          req.body.datetime_deleted = null;
        }


        service.updatePlayer(playerId, req)
                  .then(function(player) {
                        
                    res.send({
                      ok: true,
                      affectedRows: player.affectedRows
                    });
                  })
                  .catch((err) => setImmediate(() => { 
                    console.log('updatePlayer: ' + Date() + '\n' + err)
                    res.status(err.status || 500).json({
                      ok: false,
                      value: err
                    })
                  }));

      }

      
    }

  } catch (error) {
    console.log('TRY:' + Date() + '\n' + error)
          res.status(error.status || 500).json({
            ok: false,
            value: error
          })
  }
}

async function deletePlayer(req, res) {

  var playerId = req.params.id;

  service.getPlayerInfoById(playerId)
  .then(function(player) {
    if(!player){
        return res.status(400).json({
            ok:false,
            msg: `Player Id ${movieId} was not found.`
        });
    }    
    
    service.deletePlayer(playerId)
      .then(function(player) {
            
        res.send({
          ok: true,
          affectedRows: player.affectedRows
        });
      })
      .catch((err) => setImmediate(() => { 
        console.log(Date() + '\n' + err)
        res.status(err.status || 500).json({
          ok: false,
          value: err
        })
      })); 
    
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));        

}

async function searchPlayers(req, res) {

  var searchValue = req.params.search;

  service.searchPlayers(searchValue)
  .then(function(players) {

    const totalRecords = players.length;
         
    res.send({
      ok: true,
      totalRecords,
      players
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

async function searchPlayersByParameters(req, res) {

  const name = req.query.name;
  const playerPositionId = req.query.playerPositionId;
  const playerZoneId = req.query.playerZoneId;
  const playerVersionId = req.query.playerVersionId;
  const leagueTeamId = req.query.leagueTeamId;
  const leagueId = req.query.leagueId;
  const countryId = req.query.countryId;
  const rating = req.query.rating;
  const playerType = req.query.playerType;
  const duplicate = req.query.duplicate;
  const orderBy = req.query.orderBy;
  const playerSeleted = req.query.playerSeleted;
  const duplicateTimes = req.query.duplicateTimes;

  service.searchPlayersByParameters(name, playerPositionId, playerZoneId, playerVersionId, leagueTeamId, leagueId, 
                                    countryId, rating, playerType, duplicate, playerSeleted, orderBy, duplicateTimes)
  .then(function(players) {

    const totalRecords = players.length;
         
    res.send({
      ok: true,
      totalRecords,
      players
    });
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));
}

module.exports = {
    getPlayerInfo,
    getAllPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
    searchPlayers,
    searchPlayersByParameters,
    getAllPlayersDuplicate
}