if (process.env.NODE_ENV !== 'production') require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_ENGINE,
    port: parseInt(process.env.DB_PORT),
    operatorsAliases: 0,
  },
};
