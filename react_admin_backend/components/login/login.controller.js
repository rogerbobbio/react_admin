/*
MYSQL Controller
*/


var userService = require('../user/user.service');
const bcrypt = require('bcryptjs');
const { generateJWTforMySQL } = require('../../libraries/auth');
var myArray = [];
var myArraySub = [];

async function login(req, res) {

    const { email, password } = req.body;
    myArray = [];
    myArraySub = [];

    //const result = await getMenu(1245);
    //console.log(result);
  
    //Verify Email
    userService.getUserInfoByEmail(email)
    .then(function(user) {
  
        if (user === null) {
          
            return res.status(404).json({
              ok:false,
              msg: 'El usuario no existe.'
            });
  
        } else  {
          
            //Verify Password
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(400).json({
                  ok:false,
                  msg: `El password no es valido.`
              });
            }

        }

        userService.logAction('login', user.id)
          .then(function(action) {

            
          })

        
        //Get Menu
        getMenu(user.role_id).then(function(menu) {

            //JWT
            const token = generateJWTforMySQL(user.id);

            res.json({
              ok: true,
              token,
              menu: menu
            });

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

async function renewToken(req, res) {

  const uid = req.uid;
  myArray = [];
  myArraySub = [];

  //Get user information
  userService.getUserInfoById(uid)
  .then(function(user) {

      if (user === null) {
        
          return res.status(404).json({
            ok:false,
            msg: 'El usuario no existe.'
          });

      } else  {

        userService.logAction('renewToken', user.id)
          .then(function(action) {

            
          })

        //Get Menu
        getMenu(user.role_id).then(function(menu) {

          //JWT
          const token = generateJWTforMySQL(user.id);

          res.json({
            ok: true,
            token,
            user,
            menu: menu            
          });

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

function getMenu(roleId){  
  return new Promise(function(resolve, reject){
        userService.getUserMenu(roleId)
        .then(function(menu) {          
          
          var string = JSON.stringify(menu);
          var json =  JSON.parse(string);

          //Nota: el primer elemento del menu siempre debe tener 2 items

          var tituloPrincial = "";      
          var iconoPrincial = "";

          var tituloPrincialOld = "";
          var iconoPrincialOld = "";

          var tituloSub = "";
          var urlSub = "";
          
          var row = 0;
          var hacerPushPrinicipal = false;
          json.forEach(obj => {
            row = row + 1;
            Object.entries(obj).forEach(([key, value]) => {              
              if (key === "module_description") {
                if (tituloPrincial !== value) {
                  tituloPrincial = value;
                  hacerPushPrinicipal = true;
                } else {
                  hacerPushPrinicipal = false;
                }
              }
              if (key === "icon") {
                iconoPrincial = value;
              }
              if (key === "title") {
                tituloSub = value;
              }
              if (key === "url") {
                urlSub = value;
              }
            });

            if(hacerPushPrinicipal && row > 1)
            {
              myArray.push({titulo: tituloPrincialOld, icono: iconoPrincialOld, submenu: myArraySub});
              myArraySub = [];
            }

            myArraySub.push({titulo: tituloSub, url: urlSub});
            
            tituloPrincialOld = tituloPrincial;
            iconoPrincialOld = iconoPrincial;
          });
          myArray.push({titulo: tituloPrincialOld, icono: iconoPrincialOld, submenu: myArraySub});
          resolve(myArray);
        })
        .catch((err) => setImmediate(() => {
          console.log(Date() + '\n' + err)
          reject(err);          
        }));      
  });
}

module.exports = {
    login,
    renewToken
}