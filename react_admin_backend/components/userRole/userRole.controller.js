/*
MYSQL Controller for User Role
*/


var service = require('./userRole.service');

async function getAllUserRoles(req, res) {

  service.getAllUserRoles()
  .then(function(userRoles) {

    const totalRecords = userRoles.length;
         
    res.send({
      ok: true,
      totalRecords,
      userRoles: userRoles,      
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

async function createUserRole(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { description, user_create } = req.body;    

  service.getUserRoleInfo(description)
  .then(function(userRole) {      

      if (userRole === null) {        
        
        service.createUserRole(description, user_create)
        .then(function(userRole) {          

          res.send({
            ok: true,
            userRoleId: userRole.insertId
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
            msg: 'Role already registered.'
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

async function updateUserRole(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var userRoleId = req.params.id;

    try {

      const userRole = await service.getUserRoleInfoById(userRoleId);

      if(!userRole){
        return res.status(400).json({
          ok:false,
          msg: `User Role Id ${userId} was not found.`
        });
      } else {

        const { description } = req.body;

        var userRoleInfo = null;
      
        if(userRole.description !== description) {
          userRoleInfo = await service.getUserRoleInfo(description);
        }

        if (userRoleInfo !== null) {
          return res.status(400).json({
            ok:false,
            msg: `Ya existe un Rol con esa descripcion: ${description} `
          });
        } else {

          service.updateUserRole(userRoleId, req)
            .then(function(userRole) {
                  
              res.send({
                ok: true,
                affectedRows: userRole.affectedRows
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

async function deleteUserRole(req, res) {

  var userRoleId = req.params.id;

  service.getUserRoleInfoById(userRoleId)
  .then(function(userRole) {
    if(!userRole){
       return res.status(400).json({
          ok:false,
          msg: `User Role Id ${userId} was not found.`
       });
    }    
    
    service.deleteUserRole(userRoleId)
      .then(function(userRole) {
            
        res.send({
          ok: true,
          affectedRows: userRole.affectedRows
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

async function searchUserRoles(req, res) {
  var searchValue = req.params.search;

  service.searchUserRoles(searchValue)
  .then(function(userRoles) {

    const totalRecords = userRoles.length;
         
    res.send({
      ok: true,
      totalRecords,
      userRoles: userRoles,      
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
    getAllUserRoles,
    createUserRole,
    updateUserRole,
    deleteUserRole,
    searchUserRoles
}