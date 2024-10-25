const dataAccess = require('./systemModule.DAL');

function getModuleByTitle(title) {    
    return dataAccess.getModuleByTitle(title)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getModuleByOrder(orderNo) {    
    return dataAccess.getModuleByOrder(orderNo)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getModuleInfoById(moduleId) {
    return dataAccess.getModuleInfoById(moduleId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getAllModules() {
    return dataAccess.getAllModules()
    .then(function(res){
        return res;
    });
}

function searchModules(searchValue) {
    return dataAccess.searchModules(searchValue)
    .then(function(res){
        return res;
    });    
}

function createModule(title, icon, order_no, user_create) {
    return dataAccess.createModule(title, icon, order_no, user_create)
    .then(function(res){
        return res;
    });    
}

function updateModule(moduleId, req) {
    return dataAccess.updateModule(moduleId, req)
    .then(function(res){
        return res;
    });    
}

function deleteModule(moduleId) {
    return dataAccess.deleteModule(moduleId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getModuleByTitle,
    getModuleInfoById,
    getAllModules,
    searchModules,
    createModule,
    updateModule,
    deleteModule,
    getModuleByOrder
}