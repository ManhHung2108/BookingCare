"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("bookings", "reason", {
            type: Sequelize.DataTypes.STRING,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("bookings", "reason");
    },
};
