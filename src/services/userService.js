import e from "express";
import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10); //thuật toán sử dụng để hashPass

let handleUserLogin = (email, passWord) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ["email", "passWord", "roleId"], // Chỉ lấy ra các cột này
                    where: {
                        email: email,
                    },
                    raw: true,
                });
                if (user) {
                    // compare passWord
                    let checkPassword = await bcrypt.compareSync(
                        passWord,
                        user.passWord
                    );

                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        // console.log(user); //chú ý để raw: true để trả về obj
                        delete user.passWord; //xóa password đi để tránh trả về password
                        userData.user = user;
                    } else {
                        (userData.errCode = 3),
                            (userData.errMessage = "Mật khẩu không chính xác");
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User của bạn không tồn tại trong hệ thống.`;
                }

                resolve(userData);
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email của bạn không tồn tại trong hệ thống. Làm ơn thử lại email khác.`;
                resolve(userData);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                },
            });

            //tìm thấy trả về true
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";

            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["passWord"],
                    },
                });
            }

            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ["passWord"], //không trả ra passWord
                    },
                    where: { id: userId },
                });
            }

            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email có tồn tại không
            let checkEmail = await checkUserEmail(data.email);

            if (checkEmail == true) {
                resolve({
                    errCode: 1,
                    errMessage: "Email đã tồn tại!",
                });
            } else {
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

                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
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

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tồn tại người dùng!",
                });
            }

            let user = await db.User.findOne({
                where: { id: data.id },
            });

            if (user) {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                    },
                    {
                        where: {
                            id: user.id,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                    message: "Cập nhập thành công!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Không tồn tại người dùng!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        console.log(id);
        try {
            let userDelete = await db.User.findOne({
                where: { id: id },
            });

            if (!userDelete) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tồn tại người dùng!",
                });
            }

            //Nếu tồn tại thực thi xóa
            if (userDelete) {
                await db.User.destroy({ where: { id: id } }); //kết nối đến db để xóa
            }

            resolve({
                errCode: 0,
                message: "Xóa thành công!",
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin,
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser,
};
