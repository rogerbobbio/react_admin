/*
MYSQL Controller for PlayerZone
*/

var service = require('./playerZone.service');

async function getPlayerZoneInfo(req, res) {
    var playerZoneId = req.params.id;

    service.getPlayerZoneInfoById(playerZoneId)
    .then(function(playerZone) {
      if(!playerZone){
        return res.status(404).json({
          ok:false,
          msg: `Player Zone Id ${playerZoneId} was not found`
        });
      }
       
      res.send({
        ok: true,
        playerZone
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

async function getAllPlayerZones(req, res) {

  service.getAllPlayerZones()
  .then(function(playerZones) {

    const totalRecords = playerZones.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerZones,
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

async function createPlayerZone(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, player_position_id, user_create } = req.body;

  service.getPlayerZoneByDescription(description)
  .then(function(playerZone) {

      if (playerZone === null) {

        service.createPlayerZone(description, player_position_id, user_create)
        .then(function(playerZone) {
              
          res.send({
            ok: true,
            playerZoneId: playerZone.insertId            
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
            msg: 'Description already registered.'
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

async function updatePlayerZone(req, res) {

        const uid = req.uid;
        req.body.user_update = uid;
        req.body.update_date = new Date();

        var playerZoneId = req.params.id;

        try {

          const playerZone = await service.getPlayerZoneInfoById(playerZoneId);

          if(!playerZone){
            return res.status(400).json({
                ok:false,
                msg: `Player Zone Id ${playerZoneId} was not found.`
            });
          } else {

            const { description } = req.body;

            var playerZoneByDescription = null;
          
            if(playerZone.description !== description) {
                playerZoneByDescription = await service.getPlayerZoneByDescription(description);
            }

            if (playerZoneByDescription !== null) {
              return res.status(400).json({
                  ok:false,
                  msg: `Ya existe una zona con esa descripcion ${description}`
              });
            } else {

              service.updatePlayerZone(playerZoneId, req)
                .then(function(playerZone) {
                      
                  res.send({
                    ok: true,
                    affectedRows: playerZone.affectedRows
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

          }


        } catch (error) {
          console.log('TRY:' + Date() + '\n' + error)
                res.status(error.status || 500).json({
                  ok: false,
                  value: error
                })
        }
  
}

async function deletePlayerZone(req, res) {

  var playerZoneId = req.params.id;

  service.getPlayerZoneInfoById(playerZoneId)
  .then(function(playerZone) {
    if(!playerZone){
        return res.status(400).json({
            ok:false,
            msg: `Player Zone Id ${playerZoneId} was not found.`
        });
    }    
    
    service.deletePlayerZone(playerZoneId)
      .then(function(playerZone) {
            
        res.send({
          ok: true,
          affectedRows: playerZone.affectedRows
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

async function searchPlayerZones(req, res) {
  var descripcion = req.query.descripcion;  
  const playerPositionId = req.query.playerPositionId;

  service.searchPlayerZones(descripcion, playerPositionId)
  .then(function(playerZones) {

    const totalRecords = playerZones.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerZones
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

async function getPlayerZonesByPlayerPositionId(req, res) {
  var searchValue = req.params.search;

  service.getPlayerZonesByPlayerPositionId(searchValue)
  .then(function(playerZones) {
         
    res.send({
      ok: true,
      playerZones
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
    getPlayerZoneInfo,
    getAllPlayerZones,
    createPlayerZone,
    updatePlayerZone,
    deletePlayerZone,
    searchPlayerZones,
    getPlayerZonesByPlayerPositionId
}