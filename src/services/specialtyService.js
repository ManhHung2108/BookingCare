import db from "../models/index";
const createSpecialty = (data) => {
    console.log("check data from createSpecialty: ", data);
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
                    name: data.name,
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
module.exports = {
    createSpecialty,
};
