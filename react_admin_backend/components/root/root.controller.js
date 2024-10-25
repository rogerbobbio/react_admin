var service = require('./root.service');

function getAppInfo(req, res) {
    res.send({
        message: 'Hello from the API v1',
      });
}

async function testConnection(req, res) {
  service.testConnection()
    .then(function(value) {
      res.status(200).json({
        ok: true,
        value: value
      })
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(500).json({
      ok: false,
      value: err
    })
}));

}

module.exports = {
  getAppInfo,
  testConnection
}