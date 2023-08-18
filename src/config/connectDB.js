const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hoidanit", "root", null, {
    host: "localhost",
    dialect:
        "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    logging: false, //ko cho hiện thông báo câu lệnh querry trong sql
});

//Test connect
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = connectDB;
