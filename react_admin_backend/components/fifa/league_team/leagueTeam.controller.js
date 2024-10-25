/*
MYSQL Controller for LeagueTeam
*/

var service = require('./leagueTeam.service');

async function getLeagueTeamInfo(req, res) {
    var leagueTeamId = req.params.id;

    service.getLeagueTeamInfoById(leagueTeamId)
    .then(function(leagueTeam) {
      if(!leagueTeam){
        return res.status(404).json({
          ok:false,
          msg: `League Team Id ${leagueTeamId} was not found`
        });
      }
       
      res.send({
        ok: true,
        leagueTeam
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

async function getAllLeagueTeams(req, res) {

  service.getAllLeagueTeams()
  .then(function(leagueTeams) {

    const totalRecords = leagueTeams.length;
         
    res.send({
      ok: true,
      totalRecords,
      leagueTeams,
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

async function createLeagueTeam(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { name, league_id, user_create } = req.body;

  service.getLeagueTeamByName(name)
  .then(function(leagueTeam) {

      if (leagueTeam === null) {

        service.createLeagueTeam(name, league_id, user_create)
        .then(function(leagueTeam) {
              
          res.send({
            ok: true,
            leagueTeamId: leagueTeam.insertId            
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
            msg: 'Name already registered.'
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

async function updateLeagueTeam(req, res) {

        const uid = req.uid;
        req.body.user_update = uid;
        req.body.update_date = new Date();

        var leagueTeamId = req.params.id;

        try {

          const leagueTeam = await service.getLeagueTeamInfoById(leagueTeamId);

          if(!leagueTeam){
            return res.status(400).json({
                ok:false,
                msg: `League Team Id ${leagueTeamId} was not found.`
            });
          } else {

            const { name } = req.body;

            var leagueTeamByName = null;
          
            if(leagueTeam.name !== name) {
                leagueTeamByName = await service.getLeagueTeamByName(name);
            }

            if (leagueTeamByName !== null) {
              return res.status(400).json({
                  ok:false,
                  msg: `Ya existe un equipo con ese nombre ${name}`
              });
            } else {

              service.updateLeagueTeam(leagueTeamId, req)
                .then(function(leagueTeam) {
                      
                  res.send({
                    ok: true,
                    affectedRows: leagueTeam.affectedRows
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

async function deleteLeagueTeam(req, res) {

  var leagueTeamId = req.params.id;

  service.getLeagueTeamInfoById(leagueTeamId)
  .then(function(leagueTeam) {
    if(!leagueTeam){
        return res.status(400).json({
            ok:false,
            msg: `League Team Id ${leagueTeamId} was not found.`
        });
    }    
    
    service.deleteLeagueTeam(leagueTeamId)
      .then(function(leagueTeam) {
            
        res.send({
          ok: true,
          affectedRows: leagueTeam.affectedRows
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

async function searchLeagueTeams(req, res) {
  var name = req.query.name;
  const leagueId = req.query.leagueId;

  service.searchLeagueTeams(name, leagueId)
  .then(function(leagueTeams) {

    const totalRecords = leagueTeams.length;
         
    res.send({
      ok: true,
      totalRecords,
      leagueTeams
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

async function getLeagueTeamsByLeagueId(req, res) {
  var searchValue = req.params.search;

  service.getLeagueTeamsByLeagueId(searchValue)
  .then(function(leagueTeams) {
         
    res.send({
      ok: true,
      leagueTeams
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
    getLeagueTeamInfo,
    getAllLeagueTeams,
    createLeagueTeam,
    updateLeagueTeam,
    deleteLeagueTeam,
    searchLeagueTeams,
    getLeagueTeamsByLeagueId
}