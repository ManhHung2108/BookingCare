// import e from "express";
require("dotenv").config();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10); //thuật toán sử dụng để hashPass
// import db from "../models/index";
const db = require("../models/index");
const jwt = require("jsonwebtoken");
// import jwt from "jsonwebtoken";

let handleUserLogin = (email, passWord) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: [
                        "email",
                        "passWord",
                        "roleId",
                        "firstName",
                        "lastName",
                    ], // Chỉ lấy ra các cột này
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
let handleUserLogin2 = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(username);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: [
                        "id",
                        "email",
                        "passWord",
                        "roleId",
                        "firstName",
                        "lastName",
                    ],
                    where: {
                        email: username,
                    },
                    raw: true,
                });

                if (user) {
                    // compare passWord
                    let checkPassword = await bcrypt.compareSync(
                        password,
                        user.passWord
                    );

                    if (checkPassword) {
                        const token = jwt.sign(
                            {
                                id: user.id,
                                username: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.roleId,
                            },
                            process.env.JWT_ACCESS_KEY,
                            { expiresIn: "30d" }
                        );

                        userData.errCode = 0;
                        userData.message = "OK";
                        userData.token = token;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage =
                            "Tài khoản, mật khẩu không chính xác.";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Tài khoản, mật khẩu không chính xác.`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email của bạn không tồn tại trong hệ thống. Làm ơn thử lại email khác.`;
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let getInforUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu",
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: [
                        "id",
                        "email",
                        "firstName",
                        "lastName",
                        "image",
                        "gender",
                        "address",
                        "birthday",
                        "phoneNumber",
                    ],
                });

                if (user.image) {
                    user.image = Buffer.from(user.image, "base64").toString(
                        "binary"
                    );
                }

                resolve({
                    errCode: 0,
                    message: "OK",
                    data: user,
                });
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
                    include: [
                        {
                            model: db.Role,
                            attributes: ["valueVi", "valueEn"],
                        },
                    ],
                    raw: false,
                    nest: true,
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
    // console.log(data);
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
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
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

let updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Yêu cầu nhập đầy đủ thông tin!",
                });
            }

            let user = await db.User.findOne({
                where: { id: id },
            });
            if (user) {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        roleId: data.roleId,
                        positionId: data.positionId,
                        gender: data.gender,
                        image: data.avatar ? data.avatar : user.image,
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
        // console.log(id);
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

let getAllCode = (typeCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeCode) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu",
                });
            } else {
                let res = {};
                //lấy ra tất cả code thỏa mãn where
                let allcode = await db.Allcode.findAll({
                    where: { type: typeCode },
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res); //trả về
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDataByName = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!query) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu",
                });
            } else {
                let res = {};
                //lấy ra tất cả code thỏa mãn where
                let resSpecialty = await db.Specialty.findAll({
                    where: {
                        nameVi: {
                            [Op.like]: `%${query}%`,
                        },
                    },
                    attributes: ["id", "nameVi", "nameEn", "image"],
                });
                //convert image
                if (resSpecialty && resSpecialty.length > 0) {
                    resSpecialty.map((item) => {
                        item.image = resSpecialty.image = Buffer.from(
                            item.image,
                            "base64"
                        ).toString("binary");
                        return item;
                    });
                }

                let resClinic = await db.Clinic.findAll({
                    where: {
                        nameVi: {
                            [Op.like]: `%${query}%`,
                        },
                    },

                    attributes: ["id", "nameVi", "nameEn", "image"],
                });
                //convert image
                if (resClinic && resClinic.length > 0) {
                    resClinic.map((item) => {
                        item.image = resClinic.image = Buffer.from(
                            item.image,
                            "base64"
                        ).toString("binary");
                        return item;
                    });
                }

                let resDoctor = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            {
                                lastName: {
                                    [Op.like]: `%${query}%`,
                                },
                            },
                            {
                                firstName: {
                                    [Op.like]: `%${query}%`,
                                },
                            },
                        ],
                        roleId: "R2",
                    },
                    attributes: ["id", "firstName", "lastName", "image"],
                    include: [
                        {
                            model: db.Position,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: [
                                "addressClinic",
                                "nameClinic",
                                "note",
                                "priceId",
                                "paymentId",
                                "provinceId",
                                "specialtyId",
                                "clinicId",
                            ],
                            include: [
                                {
                                    model: db.Specialty,
                                    as: "specialtyData",
                                    attributes: ["nameEn", "nameVi", "image"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                //convert image
                if (resDoctor && resDoctor.length > 0) {
                    resDoctor.map((item) => {
                        item.image = resDoctor.image = Buffer.from(
                            item.image,
                            "base64"
                        ).toString("binary");
                        return item;
                    });
                }

                res.errCode = 0;
                res.data = {
                    resSpecialty,
                    resDoctor,
                    resClinic,
                };
                resolve(res); //trả về
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getDataSearch = (dataLimit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            //lấy ra tất cả code thỏa mãn where
            let resSpecialty = await db.Specialty.findAll({
                limit: parseInt(dataLimit),
            });

            //convert image
            if (resSpecialty && resSpecialty.length > 0) {
                resSpecialty.map((item) => {
                    item.image = resSpecialty.image = Buffer.from(
                        item.image,
                        "base64"
                    ).toString("binary");
                    return item;
                });
            }

            let resClinic = await db.Clinic.findAll({
                limit: parseInt(dataLimit),
            });
            //convert image
            if (resClinic && resClinic.length > 0) {
                resClinic.map((item) => {
                    item.image = resClinic.image = Buffer.from(
                        item.image,
                        "base64"
                    ).toString("binary");
                    return item;
                });
            }

            let resDoctor = await db.User.findAll({
                where: {
                    roleId: "R2",
                },
                attributes: ["id", "firstName", "lastName", "image"],
                include: [
                    {
                        model: db.Position,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: [
                            "addressClinic",
                            "nameClinic",
                            "note",
                            "priceId",
                            "paymentId",
                            "provinceId",
                            "specialtyId",
                            "clinicId",
                        ],
                        include: [
                            {
                                model: db.Specialty,
                                as: "specialtyData",
                                attributes: ["nameEn", "nameVi", "image"],
                            },
                        ],
                    },
                ],
                limit: parseInt(dataLimit),
                raw: false,
                nest: true,
            });

            //convert image
            if (resDoctor && resDoctor.length > 0) {
                resDoctor = resDoctor.map((item) => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, "base64").toString(
                            "binary"
                        );
                    }

                    return item;
                });
            }

            res.errCode = 0;
            res.data = {
                resSpecialty,
                resDoctor,
                resClinic,
            };
            resolve(res); //trả về
        } catch (error) {
            reject(error);
        }
    });
};

const updateProfile = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy người dùng!",
                });
            }

            let user = await db.User.findOne({
                where: { id: userId },
            });

            if (user) {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        image: data.avatar ? data.avatar : user.image,
                        birthday: data.birthDay ? data.birthDay : data.birthDay,
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

const changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.oldPassword || !data.newPassword) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let userData = {};

                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (user) {
                    let checkOldPassword = await bcrypt.compareSync(
                        data.oldPassword,
                        user.passWord
                    );

                    //Nếu sai mật khẩus
                    if (checkOldPassword) {
                        let hashPassWordFromByScript = await hashUserPassWord(
                            data.newPassword
                        );

                        user.passWord = hashPassWordFromByScript;
                        user.save();

                        userData.errCode = 0;
                        userData.message = "Đổi mật khẩu thành công!";
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Mật khẩu không chính xác!";
                    }
                } else {
                    userData.errCode = 1;
                    userData.errMessage = "Không tìm thấy người dùng!";
                }

                resolve(userData);
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllGender = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Gender.findAll();
            resolve({
                errCode: 0,
                message: "OK",
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

const registerUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data ||
                !data.email ||
                !data.passWord ||
                !data.firstName ||
                !data.lastName ||
                !data.phoneNumber ||
                !data.gender
            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
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
                    );

                    //map đến table User trong model, tạo mới bằng hàm create
                    await db.User.create({
                        email: data.email,
                        passWord: hashPassWordFromByScript,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        birthday: data.birthday,
                        roleId: "R3",
                    });

                    resolve({
                        errCode: 0,
                        message: "OK",
                    });
                }
            }
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
    getAllCode,
    getDataByName,
    getDataSearch,
    handleUserLogin2,
    getInforUser,
    updateProfile,
    changePassword,
    getAllGender,
    registerUser,
};
