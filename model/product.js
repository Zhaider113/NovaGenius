const conn = require('../config/dbconfig');
var Sequelize = require('sequelize');
const User = require('./user');
const { DataTypes } = Sequelize;

const Product = conn.define(
  'products',
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: { // author of the product
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }, 
    is_deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
  },{ freezeTableName: true });

// #ASSOCIATIONS
// #user (author)
User.hasMany(Product, { as: 'products', foreignKey: 'user_id' });
Product.belongsTo(User, { as: 'users', foreignKey: 'user_id' });

module.exports = Product;