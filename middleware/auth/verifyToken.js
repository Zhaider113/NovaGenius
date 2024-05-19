var jwt = require('jsonwebtoken');
var config = require('../../config/jwtConfig');
const User = require('../../model/user');

async function verifyToken(req, res, next) {

    var token = req.header('x-access-token')
    if (!token)
        return res.send({ success: false, message: 'No token provided.' });

    try {

        const verified = jwt.verify(token, config.secret);
        req.user = verified;
        const verifiedUser = await User.findOne({
            where: { 
                id: req.user.id,
                token: token
             },
          })
          if(verifiedUser){
              next();
          }else{
            return res.send({ success: false, message: 'You are logout...! Login and try again...!' });
          }
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

module.exports = verifyToken;