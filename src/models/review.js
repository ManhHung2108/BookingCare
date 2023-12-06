"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {}
    }
    Review.init(
        {
            doctorId: DataTypes.INTEGER,
            rating: DataTypes.INTEGER,
            comment: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Review",
        }
    );
    return Review;
};
