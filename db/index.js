const Sequelize = require('sequelize');

const dbConfig = require(__basedir + '/db/config/config.js')
const sequelize = new Sequelize(dbConfig.test.database, dbConfig.test.username, dbConfig.test.password, {
  host: dbConfig.test.host,
  dialect: dbConfig.test.dialect
})

sequelize
  .authenticate()
  .then(function() {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });