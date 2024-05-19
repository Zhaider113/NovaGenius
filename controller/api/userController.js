const User = require('../../model/user');
const bcrypt = require('bcryptjs');

// update user password
module.exports.updatePassword = async (req, res) => {
    try {
      let { password, confirm_password, old_password } = req.body
      let value = {}
      if (password == '') {
        return res.send({ success: false, message: 'New Password Required.' })
      }
      if (confirm_password == '') {
        return res.send({ success: false, message: 'Confirm Password Required.' })
      }
      if (old_password == '') {
        return res.send({ success: false, message: 'Old Password Required.' })
      }
      if (password != confirm_password) {
        return res.send({
          success: false,
          message: 'New Password & Confirm Password did not matched.',
        })
      }
      const userPassword = await User.findOne({
        attributes: ['id', 'password'],
        where: { id: req.user.id },
      })
      const passwordToSave = bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null,
      )
      if (
        (await bcrypt.compare(old_password, userPassword.password)) &&
        userPassword
      ) {
        value.password = passwordToSave
        User.update(value, {
          where: {
            id: req.user.id,
          },
        })
          .then((recordCreated) => {
            if (recordCreated) {
              return res.send({
                success: true,
                message: 'Password has been updated successfully.',
              })
            } else {
              return res.send({
                success: false,
                message: 'Oops! something went wrong, try again please!',
              })
            }
          })
          .catch((err) => {
            return res.send({
              success: false,
              message: 'Oops! something went wrong' + err.message,
            })
          })
      } else {
        return res.send({
          success: false,
          message: ' Old Password Did not Matched!',
        })
      }
    } catch (error) {
      res.status(500).send('Internal Server Error: ' + error)
    }
  }

/// logout
module.exports.logout = async (req, res) => {
  const token = req.headers['x-access-token'];
  User.findOne({
      where: { token: token }
  }).then(user => {
      console.log(user);
      user.token = null;
      user.isActive = false;
      user.last_login = new Date();
      user.save();
      req.user = {};
      res.send({ success: true, data: null, message: 'Logged Out Successfully' });
  }).catch(error => {
      console.log(error)
      res.send({ success: false, data: null, message: 'LoggedOutError: ' + error.message });
  })
}
