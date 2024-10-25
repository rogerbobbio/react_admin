const dataAccess = require('./playerPosition.DAL');

function getAllPlayerPositions() {    
    return dataAccess.getAllPlayerPositions()
    .then(function(res){
        return res;
    });    
}

function searchPlayerPositions(searchValue) {    
    return dataAccess.searchPlayerPositions(searchValue)
    .then(function(res){
        return res;
    });    
}

function createPlayerPosition(description, createUser) {    
    return dataAccess.createPlayerPosition(description, createUser)
    .then(function(res){
        return res;
    });    
}

function updatePlayerPosition(playerPositionId, req) {
    return dataAccess.updatePlayerPosition(playerPositionId, req)
    .then(function(res){
        return res;
    });    
}

function deletePlayerPosition(playerPositionId) {
    return dataAccess.deletePlayerPosition(playerPositionId)
    .then(function(res){
        return res;
    });    
}

function getPlayerPositionInfo(description) {
    return dataAccess.getPlayerPositionInfo(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getPlayerPositionInfoById(playerPositionId) {
    return dataAccess.getPlayerPositionInfoById(playerPositionId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllPlayerPositions,
    searchPlayerPositions,
    createPlayerPosition,
    updatePlayerPosition,
    deletePlayerPosition,
    getPlayerPositionInfo,
    getPlayerPositionInfoById
}