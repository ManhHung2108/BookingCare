// import db from "../models/index";
const db = require("../models/index");
// import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10); //thuật toán sử dụng để hashPass

let createNewUser = async (data) => {
    // console.log("data from service: ", data);
    return new Promise(async (resolve, reject) => {
        //việc dùng promise để đảm bảo dữ liệu được tạo
        try {
            let hashPassWordFromByScript = await hashUserPassWord(
                data.passWord
            ); //lấy passWord đc hash promise trả về

            //map đến table User trong model, tạo mới bằng hàm create
            await db.User.create({
                email: data.email,
                passWord: hashPassWordFromByScript,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === "1" ? true : false, //kểu boolean
                roleId: data.roleId,
            });

            resolve("Create a new user success"); //resolve tương đương vs câu lệnh return
        } catch (error) {
            reject(error); //trả về lỗi
        }
    });
};

let getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true, //config ra log chỉ chứa data trong db
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let getUserInfoById = async (userId) => {
    try {
        let userInfo = await db.User.findOne({
            where: { id: userId },
            raw: true,
        });
        return userInfo;
    } catch (error) {
        return false;
    }
};

let updateUserData = async (data) => {
    // console.log("data from service: ", data);
    let userUpdate = getUserInfoById(data.id); //tìm ra user
    if (userUpdate) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.update(data, {
                    where: {
                        id: data.id,
                    },
                });
                //Trả về danh sách sau khi cập nhập để controller hiển thị lên
                let allUser = await db.User.findAll();
                resolve(allUser); //phải trả về resolve hoặc reject để thoát khỏi promise
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    } else {
        return false;
    }
};

let deleteUserById = (id) => {
    if (id) {
        return new Promise(async (resolve, reject) => {
            try {
                //C1
                await db.User.destroy({
                    where: {
                        id: id,
                    },
                });

                //C2: Tìm ra đối tượng sau đó mới xóa
                // let userDelete = await db.User.findOne({
                //     where: {
                //         id: id,
                //     },
                // });
                // if (userDelete) {
                //     await userDelete.destroy();
                // }
                let allUser = await db.User.findAll();
                resolve(allUser); //thoát khỏi promise, tương tự return
            } catch (error) {
                reject(error);
            }
        });
    } else {
        return false;
    }
};

let hashUserPassWord = (passWord) => {
    //Dùng promise để đảm bảo hàm luôn trả cho chúng ta tránh việc bất đồng bộ của js
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(passWord, salt); //chờ thư viện băm mật khẩu ra
            resolve(hashPassWord); //trả về
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
};
