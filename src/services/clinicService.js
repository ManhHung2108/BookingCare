import db from "../models/index";
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
                    image: data.imageBase64,
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

const getDetailClinicById = (id, location) => {
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
                    where: { id: id },
                    attributes: [
                        "descriptionHTML",
                        "descriptionMarkdown",
                        "nameEn",
                        "nameVi",
                        "image",
                    ],
                });

                if (data) {
                    let doctorClinic = [];
                    if (location === "ALL") {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: { clinicId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: {
                                clinicId: id,
                                provinceId: location,
                            },
                            attributes: ["doctorId", "provinceId"],
                        });
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

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};
