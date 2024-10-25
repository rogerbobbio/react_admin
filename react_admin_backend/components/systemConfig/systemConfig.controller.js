var service = require('./systemConfig.service');

async function updateSystemConfig(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    service.getSystemConfigInfo()
    .then(function(config) {
      if(!config){
        return res.status(400).json({
            ok:false,
            msg: `The Config info was not found.`
        });
      } else {

        service.updateSystemConfig(req)
        .then(function(config) {
                        
          res.send({
            ok: true,
            affectedRows: config.affectedRows
          });
        })
        .catch((err) => setImmediate(() => {
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        })); 

      }
    })
    .catch((err) => setImmediate(() => { 
      console.log(Date() + '\n' + err)
      res.status(err.status || 500).json({
        ok: false,
        value: err
      })
    }));

}

async function getSystemConfigInfo(req, res) {
    
    service.getSystemConfigInfo()
    .then(function(config) {
      if(!config){
        return res.status(404).json({
          ok:false,
          msg: `The config info was not found`
        });
      }
       
      res.send({
        ok: true,
        config
      });
    })
    .catch((err) => setImmediate(() => { 
      console.log(Date() + '\n' + err)
      res.status(err.status || 500).json({
        ok: false,
        value: err
      })
    }));
}

module.exports = {
    updateSystemConfig,
    getSystemConfigInfo
}