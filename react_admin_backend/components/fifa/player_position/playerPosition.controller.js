/*
MYSQL Controller for Player Position
*/


var service = require('./playerPosition.service');

async function getAllPlayerPositions(req, res) {

  service.getAllPlayerPositions()
  .then(function(playerPositions) {

    const totalRecords = playerPositions.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerPositions: playerPositions,      
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

async function createPlayerPosition(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, user_create } = req.body;    

  service.getPlayerPositionInfo(description)
  .then(function(playerPosition) {      

      if (playerPosition === null) {        
        
        service.createPlayerPosition(description, user_create)
        .then(function(playerPosition) {          

          res.send({
            ok: true,
            playerPositionId: playerPosition.insertId
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
            msg: 'Player Position already registered.'
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

async function updatePlayerPosition(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var playerPositionId = req.params.id;

    try {

      const playerPosition = await service.getPlayerPositionInfoById(playerPositionId);

      if(!playerPosition){
        return res.status(400).json({
          ok:false,
          msg: `Player Position Id ${playerPositionId} was not found.`
        });
      } else {

        const { description } = req.body;

        var playerPositionInfo = null;
      
        if(playerPosition.description !== description) {
            playerPositionInfo = await service.getPlayerPositionInfo(description);
        }

        if (playerPositionInfo !== null) {
          return res.status(400).json({
            ok:false,
            msg: `Ya existe una posicion con esa descripcion: ${description} `
          });
        } else {

          service.updatePlayerPosition(playerPositionId, req)
            .then(function(playerPosition) {
                  
              res.send({
                ok: true,
                affectedRows: playerPosition.affectedRows
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

async function deletePlayerPosition(req, res) {

  var playerPositionId = req.params.id;

  service.getPlayerPositionInfoById(playerPositionId)
  .then(function(playerPosition) {
    if(!playerPosition){
       return res.status(400).json({
          ok:false,
          msg: `Player Position Id ${userId} was not found.`
       });
    }    
    
    service.deletePlayerPosition(playerPositionId)
      .then(function(playerPosition) {
            
        res.send({
          ok: true,
          affectedRows: playerPosition.affectedRows
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

async function searchPlayerPositions(req, res) {
  var searchValue = req.params.search;

  service.searchPlayerPositions(searchValue)
  .then(function(playerPositions) {

    const totalRecords = playerPositions.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerPositions: playerPositions,      
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
    getAllPlayerPositions,
    createPlayerPosition,
    updatePlayerPosition,
    deletePlayerPosition,
    searchPlayerPositions
}