/*
MYSQL Controller for User
*/


var service = require('./user.service');
const bcrypt = require('bcryptjs');
const { generateJWTforMySQL } = require('../../libraries/auth');

async function getUserInfo(req, res) {
    var userId = req.params.id;
    //var user = service.getUserInfo(userName);

    service.getUserInfoById(userId)
    .then(function(user) {
      if(!user){        
        return res.status(404).json({
          ok:false,
          msg: `User Id ${userId} was not found`
        });
      }
       
      res.send({
        ok: true,
        user
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

async function getAllUsers(req, res) {

  service.getAllUsers()
  .then(function(users) {

    const totalRecords = users.length;
         
    res.send({
      ok: true,
      totalRecords,
      users: users,      
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

async function createUser(req, res) {
  
  const uid = req.uid;
  req.body.user_create = uid;

  const { userName, email, firstName, lastName, password, role_id, img, user_create } = req.body;  

  service.getUserInfoByEmail(email)
  .then(function(user) {

      if (user === null) {

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        const passwordCrypt = bcrypt.hashSync(password, salt);        

        service.createUser(userName, email, firstName, lastName, passwordCrypt, role_id, img, user_create)
        .then(function(user) {

          //JWT
          const token = generateJWTforMySQL(user.insertId);
              
          res.send({
            ok: true,
            userId: user.insertId,
            token
          });
        })
        .catch((err) => setImmediate(() => { 
          console.log(Date() + '\n' + err)
          res.status(err.status || 500).json({
            ok: false,
            value: err
          })
        }));

      } else  {
        return res.status(400).json({
            ok:false,
            msg: 'Email already registered.'
        });
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

async function updateUser(req, res) {

    const uid = req.uid;
    req.body.user_update = uid;
    req.body.update_date = new Date();

    var userId = req.params.id;

    try {

      const user = await service.getUserInfoById(userId);

      if(!user){
        return res.status(400).json({
        ok:false,
        msg: `User Id ${userId} was not found.`
        });
      } else {

        const { email, password } = req.body;

        if(password) {

          // Encrypt password
          const salt = bcrypt.genSaltSync();
          const passwordCrypt = bcrypt.hashSync(password, salt); 

          req.body.password = passwordCrypt;
        }

        var userInfoByEmail = null;

        // validate email
        if(user.email !== email) {
          userInfoByEmail = await service.getUserInfoByEmail(email);
        }

        if (userInfoByEmail !== null) {
          return res.status(400).json({
            ok:false,
            msg: `There is already a user with that email ${email} `
            });
        } else {

          service.updateUser(userId, req)
            .then(function(user) {
                  
              res.send({
                ok: true,
                affectedRows: user.affectedRows
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
        
      }


    } catch (error) {
      console.log('TRY:' + Date() + '\n' + error)
            res.status(error.status || 500).json({
              ok: false,
              value: error
            })
    }
  
}

async function deleteUser(req, res) {

  var userId = req.params.id;      

  service.getUserInfoById(userId)
  .then(function(user) {
    if(!user){
       return res.status(400).json({
          ok:false,
          msg: `User Id ${userId} was not found.`
       });
    }    
    
    service.deleteUser(userId)
      .then(function(user) {
            
        res.send({
          ok: true,
          affectedRows: user.affectedRows
        });
      })
      .catch((err) => setImmediate(() => { 
        console.log(Date() + '\n' + err)
        res.status(err.status || 500).json({
          ok: false,
          value: err
        })
      })); 
    
  })
  .catch((err) => setImmediate(() => { 
    console.log(Date() + '\n' + err)
    res.status(err.status || 500).json({
      ok: false,
      value: err
    })
  }));        

}

async function searchUsers(req, res) {
  var searchValue = req.params.search;

  service.searchUsers(searchValue)
  .then(function(users) {

    const totalRecords = users.length;
         
    res.send({
      ok: true,
      totalRecords,
      users: users,      
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
    getUserInfo,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers
}