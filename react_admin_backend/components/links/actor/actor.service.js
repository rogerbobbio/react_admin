const dataAccess = require('./actor.DAL');

function getAllActors() {    
    return dataAccess.getAllActors()
    .then(function(res){
        return res;        
    });    
}

function searchActors(searchValue) {
    return dataAccess.searchActors(searchValue)
    .then(function(res){
        return res;
    });    
}

function createActor(name, createUser) {
    return dataAccess.createActor(name, createUser)
    .then(function(res){
        return res;
    });    
}

function updateActor(actorId, req) {
    return dataAccess.updateActor(actorId, req)
    .then(function(res){
        return res;
    });    
}

function deleteActor(actorId) {
    return dataAccess.deleteActor(actorId)
    .then(function(res){
        return res;
    });    
}

function getActorInfo(name) {
    return dataAccess.getActorInfo(name)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getActorInfoById(actorId) {
    return dataAccess.getActorInfoById(actorId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });    
}


module.exports = {
    getAllActors,
    searchActors,
    createActor,
    updateActor,
    deleteActor,
    getActorInfo,
    getActorInfoById
}