"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("Users", "birthday", {
            type: Sequelize.DataTypes.STRING,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("Users", "birthday");
    },
};
