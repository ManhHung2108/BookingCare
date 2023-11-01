import db from "../models/index";
const createClinic = (data) => {
    // console.log("check data from createClinic: ", data);
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                await db.Specialty.create({
                    nameVi: data.name,
                    nameEn: data.nameEn,
                    address: data.address,
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
    createClinic,
};
