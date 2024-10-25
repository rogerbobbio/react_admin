const dataAccess = require('./league.DAL');

function getAllLeagues() {    
    return dataAccess.getAllLeagues()
    .then(function(res){
        return res;        
    });    
}

function searchLeagues(searchValue) {
    return dataAccess.searchLeagues(searchValue)
    .then(function(res){
        return res;
    });    
}

function createLeague(name, createUser) {
    return dataAccess.createLeague(name, createUser)
    .then(function(res){
        return res;
    });    
}

function updateLeague(leagueId, req) {
    return dataAccess.updateLeague(leagueId, req)
    .then(function(res){
        return res;
    });    
}

function deleteLeague(leagueId) {
    return dataAccess.deleteLeague(leagueId)
    .then(function(res){
        return res;
    });    
}

function getLeagueInfo(name) {
    return dataAccess.getLeagueInfo(name)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getLeagueInfoById(leagueId) {
    return dataAccess.getLeagueInfoById(leagueId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllLeagues,
    searchLeagues,
    createLeague,
    updateLeague,
    deleteLeague,
    getLeagueInfo,
    getLeagueInfoById
}