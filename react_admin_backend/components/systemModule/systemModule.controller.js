/*
MYSQL Controller for Module
*/


var service = require('./systemModule.service');

async function getModuleInfo(req, res) {
    var moduleId = req.params.id;

    service.getModuleInfoById(moduleId)
    .then(function(module) {
      if(!module){
        return res.status(404).json({
          ok:false,
          msg: `Module Id ${moduleId} was not found`
        });
      }
       
      res.send({
        ok: true,
        module
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

async function getAllModules(req, res) {

  service.getAllModules()
  .then(function(modules) {

    const totalRecords = modules.length;
         
    res.send({
      ok: true,
      totalRecords,
      modules,      
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

async function createModule(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { title, icon, order_no, user_create } = req.body;

  service.getModuleByTitle(title)
  .then(function(module) {

      if (module === null) {


        service.getModuleByOrder(order_no)
        .then(function(module) {

            if (module === null) {

              service.createModule(title, icon, order_no, user_create)
              .then(function(module) {
                    
                res.send({
                  ok: true,
                  moduleId: module.insertId            
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
                  msg: 'El numero de orden ya existe en otro modulo.'
              });
            }

        })

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

async function updateModule(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var moduleId = req.params.id;

    service.getModuleInfoById(moduleId)
    .then(function(module) {
      if(!module){             
        return res.status(400).json({
            ok:false,
            msg: `Module Id ${moduleId} was not found.`
        });
      }
      
      const { title, order_no } = req.body;
      
      if(module.title !== title) {

        service.getModuleByTitle(title)
        .then(function(module) {
      
          if (module !== null) {                
            return res.status(400).json({
                ok:false,
                msg: `There is already a module with that title ${title} `
            });
          } else {

            service.updateModule(moduleId, req)
              .then(function(module) {
                    
                res.send({
                  ok: true,
                  affectedRows: module.affectedRows
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
      
        })
        .catch((err) => setImmediate(() => { 
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        }));

      } else if(module.order_no !== order_no) {

        service.getModuleByOrder(order_no)
        .then(function(module) {
      
          if (module !== null) {
            return res.status(400).json({
                ok:false,
                msg: `There is already a module with that order ${order_no} `
            });
          } else {

            service.updateModule(moduleId, req)
              .then(function(module) {
                    
                res.send({
                  ok: true,
                  affectedRows: module.affectedRows
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
      
        })
        .catch((err) => setImmediate(() => { 
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        }));

      } else {

        service.updateModule(moduleId, req)
        .then(function(module) {
              
          res.send({
            ok: true,
            affectedRows: module.affectedRows
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
       
      
    })
    .catch((err) => setImmediate(() => { 
      console.log(Date() + '\n' + err)
      res.status(err.status || 500).json({
        ok: false,
        value: err
      })
    }));
  
}

async function deleteModule(req, res) {

  var moduleId = req.params.id;

  service.getModuleInfoById(moduleId)
  .then(function(module) {
    if(!module){
        return res.status(400).json({
            ok:false,
            msg: `Module Id ${moduleId} was not found.`
        });
    }    
    
    service.deleteModule(moduleId)
      .then(function(module) {
            
        res.send({
          ok: true,
          affectedRows: module.affectedRows
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

async function searchModules(req, res) {
  var searchValue = req.params.search;

  service.searchModules(searchValue)
  .then(function(modules) {

    const totalRecords = modules.length;
         
    res.send({
      ok: true,
      totalRecords,
      modules
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
    getModuleInfo,
    getAllModules,
    createModule,
    updateModule,
    deleteModule,
    searchModules
}