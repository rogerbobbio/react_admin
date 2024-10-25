const dataAccess = require('./user.DAL');

function getUserInfoByUserName(userCode) {    
    return dataAccess.getUserInfoByUserName(userCode)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}

function getUserInfoById(userId) {
    return dataAccess.getUserInfoById(userId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}

function getUserInfoByEmail(email) {
    return dataAccess.getUserInfoByEmail(email)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}

function getAllUsers() {    
    return dataAccess.getAllUsers()
    .then(function(res){
        return res;
    });    
}

function searchUsers(searchValue) {    
    return dataAccess.searchUsers(searchValue)
    .then(function(res){
        return res;
    });    
}

function createUser(userName, email, firstName, lastName, password, role_id, img, createUser) {    
    return dataAccess.createUser(userName, email, firstName, lastName, password, role_id, img, createUser)
    .then(function(res){
        return res;
    });    
}

function logAction(action, user_create) {    
    return dataAccess.logAction(action, user_create)
    .then(function(res){
        return res;
    });    
}

function updateUser(userId, req) {    
    return dataAccess.updateUser(userId, req)
    .then(function(res){
        return res;
    });    
}

function deleteUser(userId) {    
    return dataAccess.deleteUser(userId)
    .then(function(res){
        return res;
    });    
}

function getUserMenu(roleId) {
    return dataAccess.getUserMenu(roleId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getUserInfoByUserName,
    getAllUsers,
    createUser,
    getUserInfoByEmail,
    updateUser,
    getUserInfoById,
    deleteUser,
    searchUsers,
    getUserMenu,
    logAction
}