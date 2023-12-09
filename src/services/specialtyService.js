// import db from "../models/index";
const db = require("../models/index");
const { Op } = require("sequelize");

const createSpecialty = (data) => {
    // console.log("check data from createSpecialty: ", data);
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                await db.Specialty.create({
                    nameVi: data.name,
                    nameEn: data.nameEn,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });

                resolve({
                    errCode: 0,
                    message: "Thêm chuyên khoa thành công!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateSpecialty = (specialtyId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId) {
                resolve({
                    errCode: 2,
                    errMessage: "Yêu cầu nhập đầy đủ thông tin!",
                });
            }

            let specialty = await db.Specialty.findOne({
                where: { id: specialtyId },
            });

            if (specialty) {
                await db.Specialty.update(
                    {
                        nameVi: data.name,
                        nameEn: data.nameEn,
                        image: data.imageBase64
                            ? data.imageBase64
                            : specialty.image,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                    },
                    {
                        where: {
                            id: specialty.id,
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
                    errMessage: "Không tồn tại phòng khám!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const deleteSpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialtyDelete = await db.Specialty.findOne({
                where: { id: specialtyId },
            });

            if (!specialtyDelete) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tồn tại phòng khám!",
                });
            }

            //Nếu tồn tại thực thi xóa
            if (specialtyDelete) {
                await db.Specialty.destroy({
                    where: { id: specialtyDelete.id },
                });
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

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                raw: false,
            });
            if (data && data.length > 0) {
                // console.log("check data from getAllSpecialty: ", data);

                //gán lại thuộc tính image type từ Blob -> binary(base64)
                data.map((item) => {
                    item.image = data.image = Buffer.from(
                        item.image,
                        "base64"
                    ).toString("binary");
                    return item;
                });
            }
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

const getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let data = {};

                data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: [
                        "descriptionHTML",
                        "descriptionMarkdown",
                        "nameEn",
                        "nameVi",
                        "image",
                    ],
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location,
                            },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }

                    //Lấy ra tất cả bác sĩ thuộc chuyên khoa, tỉnh thành
                    data.doctorSpecialty = doctorSpecialty;
                    data.image = Buffer.from(data.image, "base64").toString(
                        "binary"
                    );
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    message: "OK",
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const searchSpecialtyByName = (search, lang) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (search && lang) {
                let specialties = [];
                if (lang === "vi") {
                    specialties = await db.Specialty.findAll({
                        attributes: ["nameVi", "nameEn", "image", "id"],
                        where: {
                            nameVi: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    });
                } else {
                    specialties = await db.Specialty.findAll({
                        attributes: ["nameVi", "nameEn", "image", "id"],
                        where: {
                            nameEn: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    });
                }

                if (specialties && specialties.length > 0) {
                    specialties.map((item) => {
                        item.image = specialties.image = Buffer.from(
                            item.image,
                            "base64"
                        ).toString("binary");
                        return item;
                    });
                }

                resolve({
                    errCode: 0,
                    data: specialties,
                });
            }
        } catch (error) {
            // console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialty,
    updateSpecialty,
    searchSpecialtyByName,
};
