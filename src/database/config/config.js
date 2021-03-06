const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.USERN,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    url: TEST_DATABASE_URL,
    dialect: process.env.DIALECT,
  },
  production: {
    url: PROD_DATABASE_URL,
    dialect: process.env.DIALECT,
  },
};