const dataAccess = require('./player.DAL');

function getPlayerByName(name, playerVersionId, countryId, leagueTeamId) {
    return dataAccess.getPlayerByName(name, playerVersionId, countryId, leagueTeamId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getPlayerInfoById(playerId) {
    return dataAccess.getPlayerInfoById(playerId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}

function getAllPlayers() {    
    return dataAccess.getAllPlayers()
    .then(function(res){
        return res;
    });
}

function getAllPlayersDuplicate() {    
    return dataAccess.getAllPlayersDuplicate()
    .then(function(res){
        return res;
    });
}

function searchPlayers(searchValue) {
    return dataAccess.searchPlayers(searchValue)
    .then(function(res){
        return res;
    });    
}

function searchPlayersByParameters(name, playerPositionId, playerZoneId, playerVersionId, leagueTeamId, leagueId, 
                                    countryId, rating, playerType, duplicate, playerSeleted, orderBy, duplicateTimes) {
    return dataAccess.searchPlayersByParameters(name, playerPositionId, playerZoneId, playerVersionId, leagueTeamId, leagueId, 
                                                countryId, rating, playerType, duplicate, playerSeleted, orderBy, duplicateTimes)
    .then(function(res){
        return res;
    });    
}

function createPlayer(name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
                    country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
                    datetime_deleted, order_number, user_create) {    
    return dataAccess.createPlayer(name, league_id, league_team_id, player_version_id, player_zone_id, player_position_id,
                                    country_id, rating, player_type, duplicate, duplicate_times, player_seleted, player_deleted, 
                                    datetime_deleted, order_number, user_create)
    .then(function(res){
        return res;
    });    
}

function updatePlayer(playerId, req) {    
    return dataAccess.updatePlayer(playerId, req)
    .then(function(res){
        return res;
    });    
}

function deletePlayer(playerId) {    
    return dataAccess.deletePlayer(playerId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getPlayerByName,
    getPlayerInfoById,
    getAllPlayers,
    searchPlayers,
    searchPlayersByParameters,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getAllPlayersDuplicate
}