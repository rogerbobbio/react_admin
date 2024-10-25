/*
MYSQL Controller for Permission
*/

var service = require('./systemPermission.service');

async function createPermission(req, res) {
  
    const uid = req.uid;
    req.body.user_create = uid;
  
    const { role_id, module_id, screen_id,
            access, created, edit,
            deleted, especial1, especial2,
            especial3, especial4, especial5, 
            user_create } = req.body;
  
    service.getPermissionByKey(role_id, module_id, screen_id)
    .then(function(permission) {
  
        if (permission === null) {
  
          service.createPermission(role_id, module_id, screen_id,
                                   access, created, edit,
                                   deleted, especial1, especial2,
                                   especial3, especial4, especial5, 
                                   user_create)
          .then(function(permission) {
                
            res.send({
              ok: true,
              permissionId: permission.insertId            
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
              msg: 'Permission already registered.'
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

async function updatePermission(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var permissionId = req.params.id;

    service.getPermissionInfoById(permissionId)
    .then(function(permission) {
      if(!permission){
        return res.status(400).json({
            ok:false,
            msg: `Permission Id ${permissionId} was not found.`
        });
      } else {

        service.updatePermission(permissionId, req)
        .then(function(permission) {
                        
          res.send({
            ok: true,
            affectedRows: permission.affectedRows
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

async function deletePermission(req, res) {

    var permissionId = req.params.id;
  
    service.getPermissionInfoById(permissionId)
    .then(function(permission) {
      if(!permission){
          return res.status(400).json({
              ok:false,
              msg: `Permission Id ${permissionId} was not found.`
          });
      }    
      
      service.deletePermission(permissionId)
        .then(function(permission) {
              
          res.send({
            ok: true,
            affectedRows: permission.affectedRows
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

async function getPermissionInfo(req, res) {
    var permissionId = req.params.id;

    service.getPermissionInfoById(permissionId)
    .then(function(permission) {
      if(!permission){
        return res.status(404).json({
          ok:false,
          msg: `Permission Id ${permissionId} was not found`
        });
      }
       
      res.send({
        ok: true,
        permission
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

async function getAllPermissions(req, res) {

  service.getAllPermissions()
  .then(function(permissions) {

    const totalRecords = permissions.length;
         
    res.send({
      ok: true,
      totalRecords,
      permissions,      
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

async function getPermissionByScreen(req, res) {
  
  const title = req.header('title');
  const role_id = req.header('role_id');

  service.getPermissionByScreen(title, role_id)
  .then(function(permission) {
    if(!permission){
      return res.status(404).json({
        ok:false,
        msg: `El permiso para la pantalla ${title} no fue encontrado`
      });
    }
     
    res.send({
      ok: true,
      permission
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

async function searchPermissions(req, res) {
  
  const roleId = req.query.roleId;
  const moduleId = req.query.moduleId;
  const screenId = req.query.screenId;

  service.searchPermissions(roleId,moduleId,screenId)
  .then(function(permissions) {    

    const totalRecords = permissions.length;
         
    res.send({
      ok: true,
      totalRecords,
      permissions
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

async function getSystemIndexByTable(req, res) {
  
  var tableName = req.params.table;

  service.getSystemIndexByTable(tableName)
  .then(function(systemIndex) {
    if(!systemIndex){
      return res.status(404).json({
        ok:false,
        msg: `El system index para la tabla ${tableName} no fue encontrado`
      });
    }
     
    res.send({
      ok: true,
      systemIndex
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
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionInfo,
    getAllPermissions,
    getPermissionByScreen,
    searchPermissions,
    getSystemIndexByTable
}