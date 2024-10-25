const dataAccess = require('./userRole.DAL');

function getAllUserRoles() {    
    return dataAccess.getAllUserRoles()
    .then(function(res){
        return res;
    });    
}

function searchUserRoles(searchValue) {    
    return dataAccess.searchUserRoles(searchValue)
    .then(function(res){
        return res;
    });    
}

function createUserRole(description, createUser) {    
    return dataAccess.createUserRole(description, createUser)
    .then(function(res){
        return res;
    });    
}

function updateUserRole(userRoleId, req) {
    return dataAccess.updateUserRole(userRoleId, req)
    .then(function(res){
        return res;
    });    
}

function deleteUserRole(userRoleId) {
    return dataAccess.deleteUserRole(userRoleId)
    .then(function(res){
        return res;
    });    
}

function getUserRoleInfo(description) {
    return dataAccess.getUserRoleInfo(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getUserRoleInfoById(userRoleId) {
    return dataAccess.getUserRoleInfoById(userRoleId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllUserRoles,
    searchUserRoles,
    createUserRole,
    updateUserRole,
    deleteUserRole,
    getUserRoleInfo,
    getUserRoleInfoById
}