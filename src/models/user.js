"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Allcode, {
                foreignKey: "positionId",
                targetKey: "keyMap",
                as: "positionData",
            });
            User.belongsTo(models.Allcode, {
                foreignKey: "gender",
                targetKey: "keyMap",
                as: "genderData",
            });
            //1 user chỉ chứa 1 position
            //sử dụng belongsTo đầu 1 được đặt ở User khóa ngoại positionId, gender tham chiếu tới keyMap của bảng allcodes
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            passWord: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            gender: DataTypes.STRING,
            image: DataTypes.STRING,
            roleId: DataTypes.STRING,
            positionId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
