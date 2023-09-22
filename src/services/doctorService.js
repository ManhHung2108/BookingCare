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

const getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy bác sĩ yêu cầu!",
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: {
                        exclude: ["passWord", "positionId"], //không lấy passWord
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "positionData", //chú ý đặt bên model tên mối quan hệ như nào thì phải lấy đúng
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Markdown,
                            attributes: [
                                "contentHTML",
                                "contentMarkdown",
                                "description",
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    //convert base64 sang kiểu binary
                    data.image = Buffer.from(data.image, "base64").toString(
                        "binary"
                    );
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
    getDetailDoctorById,
};
//- Sequelize sẽ trả về kết quả truy vấn dưới dạng các đối tượng JavaScript thuần túy (plain JavaScript objects) thay vì các
//đối tượng Sequelize.

//- Khi bạn đặt nest: true, Sequelize sẽ tự động tạo các mối quan hệ giữa các đối tượng kết quả truy vấn dựa trên các mối quan hệ
//đã được định nghĩa trong mô hình dữ liệu của bạn.
//- Điều này có nghĩa rằng các đối tượng con được nhúng bên trong các đối tượng cha một cách tự động theo các mối quan hệ đã được
//định nghĩa trong mô hình dữ liệu.
//- Thường được sử dụng khi bạn muốn dễ dàng truy cập dữ liệu liên quan và có mối quan hệ giữa các bảng trong cơ sở dữ liệu của bạn.
