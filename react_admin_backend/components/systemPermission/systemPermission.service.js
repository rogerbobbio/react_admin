const dataAccess = require('./systemPermission.DAL');

function createPermission(role_id, module_id, screen_id,
                          access, created, edit,
                          deleted, especial1, especial2,
                          especial3, especial4, especial5, 
                          user_create) {
    return dataAccess.createPermission(role_id, module_id, screen_id,
                                       access, created, edit,
                                       deleted, especial1, especial2,
                                       especial3, especial4, especial5, 
                                       user_create)
    .then(function(res){
        return res;
    });    
}

function updatePermission(permissionId, req) {
    return dataAccess.updatePermission(permissionId, req)
    .then(function(res){
        return res;
    });    
}

function deletePermission(permissionId) {
    return dataAccess.deletePermission(permissionId)
    .then(function(res){
        return res;
    });    
}

function getPermissionByKey(role_id, module_id, screen_id) {
    return dataAccess.getPermissionByKey(role_id, module_id, screen_id)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getPermissionInfoById(permissionId) {
    return dataAccess.getPermissionInfoById(permissionId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getAllPermissions() {
    return dataAccess.getAllPermissions()
    .then(function(res){
        return res;
    });
}

function getPermissionByScreen(title, role_id) {
    return dataAccess.getPermissionByScreen(title, role_id)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function searchPermissions(roleId, moduleId, screenId) {
    return dataAccess.searchPermissions(roleId, moduleId, screenId)
    .then(function(res){
        return res;
    });    
}

function getSystemIndexByTable(tableName) {
    return dataAccess.getSystemIndexByTable(tableName)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}


module.exports = {
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionByKey,
    getPermissionInfoById,
    getAllPermissions,
    getPermissionByScreen,
    searchPermissions,
    getSystemIndexByTable
}