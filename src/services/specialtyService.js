import db from "../models/index";
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

const getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                raw: false,
            });
            if (data && data.length > 0) {
                // console.log("check data from getAllSpecialty: ", data);

                //gán lại thuộc tính image type từ Blob -> binary(base64)
                data.map((item, index) => {
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

module.exports = {
    createSpecialty,
    getAllSpecialty,
};
