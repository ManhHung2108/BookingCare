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
            User.belongsTo(models.Position, {
                foreignKey: "positionId",
                targetKey: "id",
                as: "positionData",
            });

            User.belongsTo(models.Gender, {
                foreignKey: "gender",
                targetKey: "id",
                as: "genderData",
            });

            User.belongsTo(models.Role, {
                foreignKey: "roleId",
                targetKey: "id",
            });

            //1 user chỉ chứa 1 position
            //sử dụng belongsTo đầu 1 được đặt ở User khóa ngoại positionId, gender tham chiếu tới keyMap của bảng allcodes

            //Quan hệ 1-1: 1 bác sĩ có 1 bài đăng
            User.hasOne(models.Markdown, { foreignKey: "doctorId" }); //khóa ngoại đặt ở bảng Markdown

            //Quan hệ 1-1: 1 bác sĩ có 1 thông tin
            User.hasOne(models.Doctor_Infor, { foreignKey: "doctorId" }); //khóa ngoại đặt ở bảng Doctor_Infor

            //Quan hện 1-n: 1 bác sĩ có nhiều kế hoạch khám bệnh
            User.hasMany(models.Schedule, {
                foreignKey: "doctorId",
                as: "doctorData",
            });

            //Quan hệ 1-n: 1 bác sĩ có nhiều booking
            User.hasMany(models.Booking, {
                foreignKey: "doctorId",
                // as: "bookingData",
            });

            User.hasMany(models.Booking, {
                foreignKey: "patientId",
                as: "patientData",
            });
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
            birthday: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
