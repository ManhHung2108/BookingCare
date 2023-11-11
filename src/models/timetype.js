"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class TimeType extends Model {
        static associate(models) {
            TimeType.hasMany(models.Schedule, {
                foreignKey: "timeType",
                as: "timeData",
            });

            TimeType.hasMany(models.Booking, {
                foreignKey: "timeType",
                as: "timeTypeDataPatient",
            });
        }
    }
    TimeType.init(
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
            modelName: "TimeType",
        }
    );
    return TimeType;
};
