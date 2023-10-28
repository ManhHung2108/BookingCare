"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Doctor_Infor extends Model {
        static associate(models) {
            // define association here
            Doctor_Infor.belongsTo(models.User, { foreignKey: "doctorId" }); //khóa ngoại đặt ở Doctor_Infor

            Doctor_Infor.belongsTo(models.Allcode, {
                foreignKey: "priceId",
                targetKey: "keyMap",
                as: "priceData",
            });
            Doctor_Infor.belongsTo(models.Allcode, {
                foreignKey: "paymentId",
                targetKey: "keyMap",
                as: "paymentData",
            });
            Doctor_Infor.belongsTo(models.Allcode, {
                foreignKey: "provinceId",
                targetKey: "keyMap",
                as: "provinceData",
            });
        }
    }
    Doctor_Infor.init(
        {
            doctorId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            specialtyId: DataTypes.INTEGER,
            clinicId: DataTypes.INTEGER,
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
