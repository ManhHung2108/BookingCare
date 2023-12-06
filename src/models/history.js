"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            History.belongsTo(models.Booking, {
                foreignKey: "bookingId",
                as: "bookingData",
                targetKey: "id",
            });
        }
    }
    History.init(
        {
            patientId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
            bookingId: DataTypes.INTEGER,
            reviewId: DataTypes.INTEGER,
            description: DataTypes.TEXT,
            files: DataTypes.TEXT, //lưu đường dẫn
        },
        {
            sequelize,
            modelName: "History",
        }
    );
    return History;
};
