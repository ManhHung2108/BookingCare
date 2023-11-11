"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.hasMany(models.Doctor_Infor, {
                foreignKey: "paymentId",
                as: "paymentData",
            });
        }
    }
    Payment.init(
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
            modelName: "Payment",
        }
    );
    return Payment;
};
