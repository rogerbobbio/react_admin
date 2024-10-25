const dataAccess = require('./systemConfig.DAL');

function updateSystemConfig(req) {
    return dataAccess.updateSystemConfig(req)
    .then(function(res){
        return res;
    });    
}

function getSystemConfigInfo() {
    return dataAccess.getSystemConfigInfo()
    .then(function(res){
        if(res.length > 0) { return res[0]; }
        return null;
    });
}


module.exports = {
    updateSystemConfig,
    getSystemConfigInfo
}