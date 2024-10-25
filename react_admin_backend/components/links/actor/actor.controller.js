/*
MYSQL Controller for Actors
*/


var service = require('./actor.service');

async function getAllActors(req, res) {

  service.getAllActors()
  .then(function(actors) {

    const totalRecords = actors.length;
         
    res.send({
      ok: true,
      totalRecords,
      actors,      
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

async function getActorInfo(req, res) {

  var searchValue = req.params.search;

  service.getActorInfo(searchValue)
  .then(function(actor) {

    res.send({
      ok: true,      
      actor,
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

async function createActor(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { name, user_create } = req.body;

  service.getActorInfo(name)
  .then(function(actor) {

      if (actor === null) {
        
        service.createActor(name, user_create)
        .then(function(actor) {

          res.send({
            ok: true,
            actorId: actor.insertId
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
            msg: 'Actor already registered.'
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

async function updateActor(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var actorId = req.params.id;
    try {

      const actor = await service.getActorInfoById(actorId);

      if(!actor){             
        return res.status(400).json({
          ok:false,
          msg: `Actor Id ${actorId} was not found`
        });
      } else {

        const { name } = req.body;

        var actorInfo = null;

        if(actor.name !== name) {
          actorInfo = await service.getActorInfo(name);
        }

        if (actorInfo !== null) {                
          return res.status(400).json({
              ok:false,
              msg: `Ya existe un Actor con ese nombre ${name} `
            });
        } else {

          service.updateActor(actorId, req)
            .then(function(actor) {
                  
              res.send({
                ok: true,
                affectedRows: actor.affectedRows
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

async function deleteActor(req, res) {

  var actorId = req.params.id;

  service.getActorInfoById(actorId)
  .then(function(actor) {
    if(!actor){
       return res.status(400).json({
        ok:false,
        msg: `Actor Id ${actorId} was not found`
      });
    }    
    
    service.deleteActor(actorId)
      .then(function(actor) {
            
        res.send({
          ok: true,
          affectedRows: actor.affectedRows
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

async function searchActors(req, res) {
  var searchValue = req.params.search;

  service.searchActors(searchValue)
  .then(function(actors) {

    const totalRecords = actors.length;
         
    res.send({
      ok: true,
      totalRecords,
      actors,
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
    getAllActors,
    createActor,
    updateActor,
    deleteActor,
    searchActors,
    getActorInfo
}