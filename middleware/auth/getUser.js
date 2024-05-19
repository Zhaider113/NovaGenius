var jwt = require('jsonwebtoken');
var config = require('../../config/jwtConfig');


function getUser(req, res) {
    try {
        var token = req.header('x-access-token')
        const decoded = jwt.verify(token, config.secret);
        return decoded;

    } catch (err) {
        return false;
    }
}


module.exports = getUser;