const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("bookingcare", "root", "123456", {
//     host: "localhost",
//     dialect:
//         "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
//     logging: false, //ko cho hiện thông báo câu lệnh querry trong sql
// });

const sequelize = new Sequelize(
    "freedb_healthy_booking",
    "freedb_manhhung",
    "xJQfXU3jkNm#s$B",
    {
        host: "sql.freedb.tech",
        dialect:
            "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
        logging: false, //ko cho hiện thông báo câu lệnh querry trong sql
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        // Increase the timeout value
        timeout: 60000, // in milliseconds
    }
);

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
