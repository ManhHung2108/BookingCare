"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Doctor_Infor extends Model {
        static associate(models) {
            // define association here
            Doctor_Infor.belongsTo(models.User, { foreignKey: "doctorId" }); //khóa ngoại đặt ở Doctor_Infor
        }
    }
    Doctor_Infor.init(
        {
            doctorId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Doctor_Infor",
            // freezeTableName: true,
        }
    );
    return Doctor_Infor;
};
