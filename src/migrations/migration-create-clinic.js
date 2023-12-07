"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Clinics", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nameVi: {
                type: Sequelize.STRING,
            },
            nameEn: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            provinceId: {
                type: Sequelize.STRING,
            },
            descriptionHTML: {
                type: Sequelize.TEXT("long"),
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT("long"),
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Clinics");
    },
};

/**Dùng để tự động map vào database cho chúng ta */
