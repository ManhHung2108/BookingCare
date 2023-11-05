"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User, {
                foreignKey: "doctorId",
            });

            Booking.belongsTo(models.User, {
                foreignKey: "patientId",
                targetKey: "id",
                as: "patientData",
            });

            Booking.belongsTo(models.Allcode, {
                foreignKey: "timeType",
                targetKey: "keyMap",
                as: "timeTypeDataPatient",
            });
        }
    }
    Booking.init(
        {
            statusId: DataTypes.STRING, //là key của bảng allcode
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING, //tương tự TIMESTAMP trong SQL
            timeType: DataTypes.STRING,
            token: DataTypes.STRING, //xác thực booking để xác nhận,
            reason: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );
    return Booking;
};
