const jwtoken = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };
    
        jwtoken.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h' //expira en 12 horas
        }, (err,token) => {
            if (err) {
                console.log(err);
                reject('JWT could not be generated');
            } else {
                resolve(token);
            }
        });

    });   

}

function generateJWTforMySQL(uid) {
    const today = new Date();
    //const expirationDate = new Date(today);
    //expirationDate.setDate(today.getDate() + 60);

    const payload = {
        uid,
        //exp: parseInt(expirationDate.getTime() / 1000, 10),
      };
  
    return jwtoken.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '12h' //expira en 12 horas
    });
  }

module.exports = {
    generateJWT,
    generateJWTforMySQL
}