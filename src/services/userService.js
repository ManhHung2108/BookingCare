import db from "../models/index";
import bcrypt from "bcryptjs";

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

module.exports = {
    handleUserLogin,
    getAllUser,
};
