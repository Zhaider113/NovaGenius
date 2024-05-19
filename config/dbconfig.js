const Sequelize = require('sequelize')
const dotenv = require('dotenv').config()

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});



connection.authenticate()
    .then(() => {
        console.log('Database connected...')
    }).catch((err) => {
        console.log('Error...', err)
        // res.redirect("/error");
    })
connection.sync({

})
    .then(() => {
        console.log(`Tables are Ready`)
    }).catch((error) => {
        console.log(error.message)
    })

connection.sequelize = connection;
module.exports = connection
