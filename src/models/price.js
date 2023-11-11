"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Price extends Model {
        static associate(models) {
            Price.hasMany(models.Doctor_Infor, {
                foreignKey: "priceId",
                as: "priceData",
            });
        }
    }
    Price.init(
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
            modelName: "Price",
        }
    );
    return Price;
};
