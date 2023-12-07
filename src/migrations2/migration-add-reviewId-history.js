"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("histories", "reviewId", {
            type: Sequelize.DataTypes.INTEGER,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("histories", "reviewId");
    },
};
