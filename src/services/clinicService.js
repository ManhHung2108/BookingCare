// import db from "../models/index";
const db = require("../models/index");
const { Op } = require("sequelize");
const createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address ||
                !data.provinceId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                await db.Clinic.create({
                    nameVi: data.name,
                    nameEn: data.nameEn,
                    address: data.address,
                    provinceId: data.provinceId,
                    image: data.imageBase64 ? data.imageBase64 : null,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });

                resolve({
                    errCode: 0,
                    message: "Thêm phòng khám thành công!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateClinic = (clinicId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId || !data.provinceId) {
                resolve({
                    errCode: 2,
                    errMessage: "Yêu cầu nhập đầy đủ thông tin!",
                });
            }

            let clinic = await db.Clinic.findOne({
                where: { id: clinicId },
            });

            if (clinic) {
                await db.Clinic.update(
                    {
                        nameVi: data.name,
                        nameEn: data.nameEn,
                        address: data.address,
                        provinceId: data.provinceId,
                        image: data.imageBase64
                            ? data.imageBase64
                            : clinic.image,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                    },
                    {
                        where: {
                            id: clinic.id,
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

const deleteClinic = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinicDelete = await db.Clinic.findOne({
                where: { id: id },
            });

            if (!clinicDelete) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tồn tại người dùng!",
                });
            }

            //Nếu tồn tại thực thi xóa
            if (clinicDelete) {
                await db.Clinic.destroy({ where: { id: id } }); //kết nối đến db để xóa
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

const getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            data = await db.Clinic.findAll({
                raw: false,
            });

            if (data && data.length > 0) {
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

const getDetailClinicById = (id, location, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let data = {};
                data = await db.Clinic.findOne({
                    where: {
                        id: id,
                    },
                    attributes: [
                        "descriptionHTML",
                        "descriptionMarkdown",
                        "nameEn",
                        "nameVi",
                        "image",
                        "address",
                    ],
                });

                if (data) {
                    let doctorClinic = [];
                    let queryDoctorInfor = {
                        where: { clinicId: id },
                        attributes: ["doctorId", "provinceId"],
                    };

                    if (location === "ALL") {
                        if (search) {
                            const doctorIds = await db.User.findAll({
                                where: {
                                    [Op.or]: [
                                        {
                                            lastName: {
                                                [Op.like]: `%${search}%`,
                                            },
                                        },
                                        {
                                            firstName: {
                                                [Op.like]: `%${search}%`,
                                            },
                                        },
                                    ],
                                },
                                attributes: ["id", "firstName", "lastName"],
                            });

                            if (doctorIds.length > 0) {
                                //tìm kiếm trong một danh sách các giá trị <=> SELECT * FROM users WHERE id IN (1, 2, 3);
                                queryDoctorInfor.where.doctorId = {
                                    [Op.in]: doctorIds.map((user) => user.id),
                                };
                            }
                        }

                        doctorClinic = await db.Doctor_Infor.findAll(
                            queryDoctorInfor
                        );
                    } else {
                        queryDoctorInfor.where.provinceId = location;
                        if (search) {
                            const doctorIds = await db.User.findAll({
                                where: {
                                    [Op.or]: [
                                        {
                                            lastName: {
                                                [Op.like]: `%${search}%`,
                                            },
                                        },
                                        {
                                            firstName: {
                                                [Op.like]: `%${search}%`,
                                            },
                                        },
                                    ],
                                },
                                attributes: ["id", "firstName", "lastName"],
                            });

                            if (doctorIds.length > 0) {
                                queryDoctorInfor.where.doctorId = {
                                    [Op.in]: doctorIds.map((user) => user.id),
                                };
                            }
                        }
                        doctorClinic = await db.Doctor_Infor.findAll(
                            queryDoctorInfor
                        );
                    }

                    //Lấy ra tất cả bác sĩ thuộc chuyên khoa, tỉnh thành
                    data.doctorClinic = doctorClinic;
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

const searchClinicByName = (search, lang) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (search && lang) {
                let clinics = [];
                if (lang === "vi") {
                    clinics = await db.Clinic.findAll({
                        attributes: ["nameVi", "nameEn", "image", "id"],
                        where: {
                            nameVi: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    });
                } else {
                    clinics = await db.Clinic.findAll({
                        attributes: ["nameVi", "nameEn", "image", "id"],
                        where: {
                            nameEn: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    });
                }

                if (clinics && clinics.length > 0) {
                    clinics.map((item) => {
                        item.image = clinics.image = Buffer.from(
                            item.image,
                            "base64"
                        ).toString("binary");
                        return item;
                    });
                }

                resolve({
                    errCode: 0,
                    data: clinics,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
    updateClinic,
    deleteClinic,
    searchClinicByName,
};
