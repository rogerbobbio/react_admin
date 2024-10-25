const dataAccess = require('./playerZone.DAL');

function getPlayerZoneByDescription(description) {
    return dataAccess.getPlayerZoneByDescription(description)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getPlayerZoneInfoById(playerZoneId) {
    return dataAccess.getPlayerZoneInfoById(playerZoneId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getAllPlayerZones() {
    return dataAccess.getAllPlayerZones()
    .then(function(res){
        return res;
    });
}

function searchPlayerZones(description, playerPositionId) {
    return dataAccess.searchPlayerZones(description, playerPositionId)
    .then(function(res){
        return res;
    });    
}

function createPlayerZone(description, playerPositionId, user_create) {
    return dataAccess.createPlayerZone(description, playerPositionId, user_create)
    .then(function(res){
        return res;
    });    
}

function updatePlayerZone(playerZoneId, req) {
    return dataAccess.updatePlayerZone(playerZoneId, req)
    .then(function(res){
        return res;
    });    
}

function deletePlayerZone(playerZoneId) {
    return dataAccess.deletePlayerZone(playerZoneId)
    .then(function(res){
        return res;
    });    
}

function getPlayerZonesByPlayerPositionId(playerPositionId) {
    return dataAccess.getPlayerZonesByPlayerPositionId(playerPositionId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getPlayerZoneByDescription,
    getPlayerZoneInfoById,
    getAllPlayerZones,
    searchPlayerZones,
    createPlayerZone,
    updatePlayerZone,
    deletePlayerZone,
    getPlayerZonesByPlayerPositionId
}