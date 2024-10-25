const jwtoken = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

    //Leer el token
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok:false,
            msg: 'There is no token in the request'
        })
    }

    try {

        const { uid } = jwtoken.verify(token, process.env.JWT_SECRET_KEY);

        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalid'
        })
    }    
}

module.exports = {
    validateJWT
}