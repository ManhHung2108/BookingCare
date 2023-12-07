"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "birthday", {
            type: Sequelize.DataTypes.STRING,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("users", "birthday");
    },
};
