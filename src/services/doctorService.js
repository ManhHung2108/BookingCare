import db from "../models/index";

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ["passWord"], //không lấy passWord
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"], //lấy ra
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"], //lấy ra
                    },
                ],
                where: { roleId: "R2" },
                order: [["createdAt", "desc"]],
                limit: parseInt(limit),
                raw: true,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            reject(error);
            //khi reject ở đây, có lỗi sẽ chạy vào catch bên controller gọi nó
        }
    });
};

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ["passWord", "image"], //không lấy passWord
                },
                where: { roleId: "R2" },
                raw: true,
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            // console.log(error);
            reject(error);
        }
    });
};

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });

                resolve({
                    errCode: 0,
                    message: "Lưu thông tin bác sĩ thành công!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
};
