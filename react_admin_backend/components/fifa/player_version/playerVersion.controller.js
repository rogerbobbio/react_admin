/*
MYSQL Controller for Player Version
*/


var service = require('./playerVersion.service');

async function getAllPlayerVersions(req, res) {

  service.getAllPlayerVersions()
  .then(function(playerVersions) {

    const totalRecords = playerVersions.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerVersions: playerVersions,      
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

async function createPlayerVersion(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, user_create } = req.body;    

  service.getPlayerVersionInfo(description)
  .then(function(playerVersion) {      

      if (playerVersion === null) {        
        
        service.createPlayerVersion(description, user_create)
        .then(function(playerVersion) {          

          res.send({
            ok: true,
            playerVersionId: playerVersion.insertId
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
            msg: 'Player Version already registered.'
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

async function updatePlayerVersion(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var playerVersionId = req.params.id;

    try {

      const playerVersion = await service.getPlayerVersionInfoById(playerVersionId);

      if(!playerVersion){
        return res.status(400).json({
          ok:false,
          msg: `Player Version Id ${playerVersionId} was not found.`
        });
      } else {

        const { description } = req.body;

        var playerVersionInfo = null;
      
        if(playerVersion.description !== description) {
            playerVersionInfo = await service.getPlayerVersionInfo(description);
        }

        if (playerVersionInfo !== null) {
          return res.status(400).json({
            ok:false,
            msg: `Ya existe una version de jugador con esa descripcion: ${description} `
          });
        } else {

          service.updatePlayerVersion(playerVersionId, req)
            .then(function(playerVersion) {
                  
              res.send({
                ok: true,
                affectedRows: playerVersion.affectedRows
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

async function deletePlayerVersion(req, res) {

  var playerVersionId = req.params.id;

  service.getPlayerVersionInfoById(playerVersionId)
  .then(function(playerVersion) {
    if(!playerVersion){
       return res.status(400).json({
          ok:false,
          msg: `Player Version Id ${userId} was not found.`
       });
    }    
    
    service.deletePlayerVersion(playerVersionId)
      .then(function(playerVersion) {
            
        res.send({
          ok: true,
          affectedRows: playerVersion.affectedRows
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

async function searchPlayerVersions(req, res) {
  var searchValue = req.params.search;

  service.searchPlayerVersions(searchValue)
  .then(function(playerVersions) {

    const totalRecords = playerVersions.length;
         
    res.send({
      ok: true,
      totalRecords,
      playerVersions: playerVersions,      
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
    getAllPlayerVersions,
    createPlayerVersion,
    updatePlayerVersion,
    deletePlayerVersion,
    searchPlayerVersions
}