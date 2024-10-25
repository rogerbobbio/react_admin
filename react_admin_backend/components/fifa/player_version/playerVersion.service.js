const dataAccess = require('./playerVersion.DAL');

function getAllPlayerVersions() {    
    return dataAccess.getAllPlayerVersions()
    .then(function(res){
        return res;
    });    
}

function searchPlayerVersions(searchValue) {    
    return dataAccess.searchPlayerVersions(searchValue)
    .then(function(res){
        return res;
    });    
}

function createPlayerVersion(description, createUser) {    
    return dataAccess.createPlayerVersion(description, createUser)
    .then(function(res){
        return res;
    });    
}

function updatePlayerVersion(playerVersionId, req) {
    return dataAccess.updatePlayerVersion(playerVersionId, req)
    .then(function(res){
        return res;
    });    
}

function deletePlayerVersion(playerVersionId) {
    return dataAccess.deletePlayerVersion(playerVersionId)
    .then(function(res){
        return res;
    });    
}

function getPlayerVersionInfo(description) {
    return dataAccess.getPlayerVersionInfo(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getPlayerVersionInfoById(playerVersionId) {
    return dataAccess.getPlayerVersionInfoById(playerVersionId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllPlayerVersions,
    searchPlayerVersions,
    createPlayerVersion,
    updatePlayerVersion,
    deletePlayerVersion,
    getPlayerVersionInfo,
    getPlayerVersionInfoById
}