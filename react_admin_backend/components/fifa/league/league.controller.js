/*
MYSQL Controller for League
*/


var service = require('./league.service');

async function getAllLeagues(req, res) {

  service.getAllLeagues()
  .then(function(leagues) {

    const totalRecords = leagues.length;
         
    res.send({
      ok: true,
      totalRecords,
      leagues,
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

async function getLeagueInfo(req, res) {

  var searchValue = req.params.search;

  service.getLeagueInfo(searchValue)
  .then(function(league) {

    res.send({
      ok: true,      
      league,
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

async function createLeague(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { name, user_create } = req.body;

  service.getLeagueInfo(name)
  .then(function(league) {

      if (league === null) {
        
        service.createLeague(name, user_create)
        .then(function(league) {

          res.send({
            ok: true,
            leagueId: league.insertId
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
            msg: 'Liga ya registrada.'
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

async function updateLeague(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var leagueId = req.params.id;
    try {

      const league = await service.getLeagueInfoById(leagueId);

      if(!league){             
        return res.status(400).json({
          ok:false,
          msg: `League Id ${leagueId} was not found`
        });
      } else {

        const { name } = req.body;

        var leagueInfo = null;

        if(league.name !== name) {
            leagueInfo = await service.getLeagueInfo(name);
        }

        if (leagueInfo !== null) {                
          return res.status(400).json({
              ok:false,
              msg: `Ya existe una Liga con ese nombre ${name} `
            });
        } else {

          service.updateLeague(leagueId, req)
            .then(function(league) {
                  
              res.send({
                ok: true,
                affectedRows: league.affectedRows
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

async function deleteLeague(req, res) {

  var leagueId = req.params.id;

  service.getLeagueInfoById(leagueId)
  .then(function(league) {
    if(!league){
       return res.status(400).json({
        ok:false,
        msg: `League Id ${leagueId} was not found`
      });
    }    
    
    service.deleteLeague(leagueId)
      .then(function(league) {
            
        res.send({
          ok: true,
          affectedRows: league.affectedRows
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

async function searchLeagues(req, res) {
  var searchValue = req.params.search;

  service.searchLeagues(searchValue)
  .then(function(leagues) {

    const totalRecords = leagues.length;
         
    res.send({
      ok: true,
      totalRecords,
      leagues,
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
    getAllLeagues,
    getLeagueInfo,
    createLeague,
    updateLeague,
    deleteLeague,
    searchLeagues
}