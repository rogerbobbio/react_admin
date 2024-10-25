/*
MYSQL Controller for Screen
*/


var service = require('./systemScreen.service');

async function getScreenInfo(req, res) {
    var screenId = req.params.id;

    service.getScreenInfoById(screenId)
    .then(function(screen) {
      if(!screen){
        return res.status(404).json({
          ok:false,
          msg: `Screen Id ${screenId} was not found`
        });
      }
       
      res.send({
        ok: true,
        screen
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

async function getAllScreens(req, res) {

  service.getAllScreens()
  .then(function(screens) {

    const totalRecords = screens.length;
         
    res.send({
      ok: true,
      totalRecords,
      screens,      
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

async function createScreen(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { title, url, order_no, module_id, user_create } = req.body;

  service.getScreenByTitle(title)
  .then(function(screen) {

      if (screen === null) {

        service.createScreen(title, url, order_no, module_id, user_create)
        .then(function(screen) {
              
          res.send({
            ok: true,
            screenId: screen.insertId            
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
            msg: 'Title already registered.'
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

async function updateScreen(req, res) {

        const uid = req.uid;
        req.body.user_update = uid;
        req.body.update_date = new Date();

        var screenId = req.params.id;

        try {

          const screen = await service.getScreenInfoById(screenId);

          if(!screen){
            return res.status(400).json({
                ok:false,
                msg: `Screen Id ${screenId} was not found.`
            });
          } else {

            const { title } = req.body;

            var screenByTitle = null;
          
            if(screen.title !== title) {
              screenByTitle = await service.getScreenByTitle(title);
            }

            if (screenByTitle !== null) {                
              return res.status(400).json({
                  ok:false,
                  msg: `Ya existe una pantalla con ese titulo ${title}`
              });
            } else {

              service.updateScreen(screenId, req)
                .then(function(screen) {
                      
                  res.send({
                    ok: true,
                    affectedRows: screen.affectedRows
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

async function deleteScreen(req, res) {

  var screenId = req.params.id;

  service.getScreenInfoById(screenId)
  .then(function(screen) {
    if(!screen){
        return res.status(400).json({
            ok:false,
            msg: `Screen Id ${screenId} was not found.`
        });
    }    
    
    service.deleteScreen(screenId)
      .then(function(screen) {
            
        res.send({
          ok: true,
          affectedRows: screen.affectedRows
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

async function searchScreens(req, res) {
  var title = req.query.title;  
  const moduleId = req.query.moduleId;

  service.searchScreens(title, moduleId)
  .then(function(screens) {

    const totalRecords = screens.length;
         
    res.send({
      ok: true,
      totalRecords,
      screens
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

async function getScreensByModuleId(req, res) {
  var searchValue = req.params.search;

  service.getScreensByModuleId(searchValue)
  .then(function(screens) {
         
    res.send({
      ok: true,
      screens
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
  getScreenInfo,
  getAllScreens,
  createScreen,
  updateScreen,
  deleteScreen,
  searchScreens,
  getScreensByModuleId
}