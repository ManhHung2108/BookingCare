const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bookingcare", "root", "123456", {
    host: "localhost",
    dialect:
        "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    logging: false, //ko cho hiện thông báo câu lệnh querry trong sql
});

//Test connect
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối thành công đến cơ sở dữ liệu.");
    } catch (error) {
        console.error("Không thể kết nối đến cơ sở dữ liệu:", error);
    }
};

module.exports = connectDB;
