const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config').db;
console.error('sagar',config);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port
});




const db = {};
fs.readdirSync(__dirname)
  .filter(f => f !== 'index.js' && f.endsWith('.js'))
  .forEach(file => {
    console.log(`_dirname: ${__dirname}`);
    console.log(`_dirname: ${file}`);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log(`Loading model from file: ${file}`);
    console.log(`Model:`, model);
    db[model.name] = model;
  });
Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;