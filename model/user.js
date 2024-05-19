const conn = require('../config/dbconfig');
var Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
var bcrypt = require("bcryptjs");


var users = conn.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            args: true,
            msg: "User Already Exist"
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, { freezeTableName: true });

// PASSWORD HASH
users.beforeSave((user) => {
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }

});

// // PASSWORD HASH
users.beforeUpdate((customer) => {
    if (customer.changed('password')) {
        customer.password = bcrypt.hashSync(customer.password, bcrypt.genSaltSync(10), null);
    }
})
// CAMPARE PASSWORD DURING LOGIN
users.prototype.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);

    });
};
// user Question Answer Relation 
// users.hasMany(UserTest, { foreignKey: 'user_id', as: 'user_test' });
// UserTest.belongsTo(users, { foreignKey: 'user_id', as: 'user_test' });

module.exports = users;