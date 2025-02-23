const { config } = require("dotenv");
config();
const pe = process.env;

const databaseConfig = {
  username: pe.DB_USERNAME,
  password: pe.DB_PASSWORD,
  database: pe.DB_DATABASE,
  host: pe.DB_HOST,
  port: pe.DB_PORT,
  dialect: "postgres",
  storage: pe.DB_STORAGE,
};

console.log("database configuration", databaseConfig);
module.exports = databaseConfig;
