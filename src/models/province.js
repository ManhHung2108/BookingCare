"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            Province.hasMany(models.Doctor_Infor, {
                foreignKey: "provinceId",
                as: "provinceData",
            });
        }
    }
    Province.init(
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
            modelName: "Province",
        }
    );
    return Province;
};
