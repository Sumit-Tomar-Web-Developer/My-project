import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('new_db', 'root', 'root', {

  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true
  },
  pool: {
    max: 100,
    min: 0,
    acquire: 300000, // increase to 60s if needed
    idle: 100000
  },
  port: 3306,
  // jdbcDir: "C:\\Program Files\\MySQL\\MySQL Connector ODBC 9.5\\mysql-connector-j-9.5.0",
});

// Test the connection
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
