const dataAccess = require('./systemScreen.DAL');

function getScreenByTitle(title) {
    return dataAccess.getScreenByTitle(title)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getScreenInfoById(screenId) {
    return dataAccess.getScreenInfoById(screenId)
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}

function getAllScreens() {
    return dataAccess.getAllScreens()
    .then(function(res){
        return res;
    });
}

function searchScreens(title, moduleId) {
    return dataAccess.searchScreens(title, moduleId)
    .then(function(res){
        return res;
    });    
}

function createScreen(title, url, order_no, module_id, user_create) {
    return dataAccess.createScreen(title, url, order_no, module_id, user_create)
    .then(function(res){
        return res;
    });    
}

function updateScreen(screenId, req) {
    return dataAccess.updateScreen(screenId, req)
    .then(function(res){
        return res;
    });    
}

function deleteScreen(screenId) {
    return dataAccess.deleteScreen(screenId)
    .then(function(res){
        return res;
    });    
}

function getScreensByModuleId(moduleId) {
    return dataAccess.getScreensByModuleId(moduleId)
    .then(function(res){
        return res;
    });    
}

module.exports = {
    getScreenByTitle,
    getScreenInfoById,
    getAllScreens,
    searchScreens,
    createScreen,
    updateScreen,
    deleteScreen,
    getScreensByModuleId
}