"use strict";
/** File để tạo nhanh dữ liệu fake */
module.exports = {
    //thêm data
    up: async (queryInterface, Sequelize) => {
        //Tạo ra một đối tượng cho bảng Users
        return queryInterface.bulkInsert("Users", [
            {
                email: "admin@gmail.com",
                passWord: "123456", //plain text, còn: hsdskjdkjs123jk23j12 -> hash passWord(được băm ra rồi tránh tình trạng lộ thông tin)
                firstName: "Do",
                lastName: "Manh Hung",
                address: "Việt Nam",
                gender: 1,
                typeRole: "ROLE",
                keyRole: "R1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    //rollback(chạy lỗi back lại version ko lỗi)
    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
//create seed:
//npx sequelize-cli seed:generate --name demo-user

//running seed:
//npx sequelize-cli db:seed:all
