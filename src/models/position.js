"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Position extends Model {
        static associate(models) {
            //1-n
            Position.hasMany(models.User, {
                foreignKey: "positionId",
                as: "positionData",
            });
        }
    }
    Position.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            valueEn: DataTypes.STRING,
            valueVi: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Position",
        }
    );
    return Position;
};
