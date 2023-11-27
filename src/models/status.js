"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Status extends Model {
        static associate(models) {
            Status.hasMany(models.Booking, {
                foreignKey: "statusId",
                as: "statusData",
            });
        }
    }
    Status.init(
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
            modelName: "Status",
            freezeTableName: true, // Tên bảng không đặt là số nhiều
        }
    );
    return Status;
};
