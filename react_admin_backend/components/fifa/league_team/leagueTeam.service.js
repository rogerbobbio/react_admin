const dataAccess = require('./leagueTeam.DAL');

function getLeagueTeamByName(name) {
    return dataAccess.getLeagueTeamByName(name)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getLeagueTeamInfoById(leagueTeamId) {
    return dataAccess.getLeagueTeamInfoById(leagueTeamId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getAllLeagueTeams() {
    return dataAccess.getAllLeagueTeams()
    .then(function(res){
        return res;
    });
}

function searchLeagueTeams(name, leagueId) {
    return dataAccess.searchLeagueTeams(name, leagueId)
    .then(function(res){
        return res;
    });    
}

function createLeagueTeam(name, leagueId, user_create) {
    return dataAccess.createLeagueTeam(name, leagueId, user_create)
    .then(function(res){
        return res;
    });    
}

function updateLeagueTeam(leagueTeamId, req) {
    return dataAccess.updateLeagueTeam(leagueTeamId, req)
    .then(function(res){
        return res;
    });    
}

function deleteLeagueTeam(leagueTeamId) {
    return dataAccess.deleteLeagueTeam(leagueTeamId)
    .then(function(res){
        return res;
    });    
}

function getLeagueTeamsByLeagueId(leagueId) {
    return dataAccess.getLeagueTeamsByLeagueId(leagueId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getLeagueTeamByName,
    getLeagueTeamInfoById,
    getAllLeagueTeams,
    searchLeagueTeams,
    createLeagueTeam,
    updateLeagueTeam,
    deleteLeagueTeam,
    getLeagueTeamsByLeagueId
}