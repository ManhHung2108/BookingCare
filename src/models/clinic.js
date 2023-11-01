/**Phòng khám */
"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Clinic.init(
        {
            nameVi: DataTypes.STRING,
            nameEn: DataTypes.STRING,
            address: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            descriptionHTML: DataTypes.TEXT("long"),
            descriptionMarkdown: DataTypes.TEXT("long"),
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Clinic",
        }
    );
    return Clinic;
};
