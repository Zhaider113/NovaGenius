const User = require('../../model/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwtConfig');


// Register User 
module.exports.Register_User = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.json({ success: false, message: 'Please Fill All The Field', data: [] })
        } else {
            let user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            if (user) {
                const user_id = user.id
                let userData = { id: user_id, email: user.email };
                let token = jwt.sign(userData, jwtConfig.secret, { expiresIn: '365d' });
                user.isActive = true;
                last_login = new Date();
                const userUpadte = await User.update({
                    token: token
                }, {
                    where: {
                        id: user_id
                    }
                })
                let findUser = await User.findOne({
                    where: {
                        id: user_id
                    }
                })
                res.json({ success: true, message: "Wellcome to Nova Genius", data: findUser })
            } else {
                res.json({ success: false, message: 'Registration Failed', data: [] })
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: [] })
    }
}

// Login User 
module.exports.Login_User = async (req, res, next) => {
    try {
        passport.authenticate('user', async function (err, user, info) {
            if (err) {
                console.log(err);
                return res.json({ 'success': false, data: null, message: '', err });
            }

            // Generate a JSON response reflecting authentication status
            if (!user) {
                return res.json({ 'success': false, data: null, message: 'User not Found : ' + info });

            }

            req.login(user, loginErr => {

                if (loginErr) {
                    return res.json({ 'success': false, data: null, message: '' + loginErr.message });
                }
                let userData = { id: user.id, email: user.email };
                // expiresIn time
                let token = jwt.sign(userData, jwtConfig.secret, { expiresIn: '365d' });
                user.isActive = true;
                user.token = token;

                user.last_login = new Date();
                user.save();

                let data = {
                    token: token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
                return res.json({
                    data: data,
                    success: true,
                    message: "User Login Successfully"

                })

            });
        })(req, res, next);
    } catch (error) {
        res.status(500).json({ success: false, message: `Something Is Wrong. ${error}`, data: [] })
    }
}