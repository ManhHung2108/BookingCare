require("dotenv").config();
import moment from "moment";
const Sequelize = require("sequelize");
const { Op } = Sequelize;
import _ from "lodash";
import db from "../models/index";
import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ["passWord"], //không lấy passWord
                },
                include: [
                    {
                        model: db.Position,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"], //lấy ra
                    },
                    {
                        model: db.Gender,
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

let getTopDoctor = (limit) => {
    // Tính ngày 7 ngày trước ngày hiện tại
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Booking.findAll({
                attributes: [
                    [Sequelize.col("Booking.doctorId"), "doctorId"],
                    [
                        Sequelize.fn(
                            "COUNT",
                            Sequelize.col("Booking.doctorId")
                        ),
                        "appointmentCount",
                    ],
                ],
                include: [
                    {
                        model: db.User,
                        attributes: {
                            exclude: ["passWord"], //không lấy passWord
                        },
                        include: [
                            {
                                model: db.Position,
                                as: "positionData",
                                attributes: ["valueEn", "valueVi"], //lấy ra
                            },
                            {
                                model: db.Doctor_Infor,
                                attributes: ["specialtyId"],
                                include: [
                                    {
                                        model: db.Specialty,
                                        as: "specialtyData",
                                        attributes: ["nameVi", "nameEn"], //lấy ra
                                    },
                                ],
                            },
                        ],
                    },
                ],
                where: {
                    //[Op.gte]: đại diện cho toán tử "greater than or equal" (lớn hơn hoặc bằng) trong các điều kiện truy vấn.
                    createdAt: {
                        // [Op.gte]: sevenDaysAgo, // Lọc theo ngày tạo trong vòng 7 ngày gần đây
                        [Op.between]: [
                            new Date().setHours(0, 0, 0, 0),
                            new Date().setDate(new Date().getDate() + 7),
                        ],
                    },
                },
                group: [
                    "doctorId",
                    "User->positionData.id",
                    "User->Doctor_Infor.id",
                ],
                order: [
                    [Sequelize.fn("COUNT", Sequelize.col("doctorId")), "DESC"],
                ],
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
        }
    });
};

// - Có thể có nhiều cuộc hẹn của cùng một bác sĩ tại cùng một vị trí, và GROUP BY được sử dụng để tổng hợp số lượng cuộc hẹn này
//lại thành một dòng dữ liệu duy nhất cho mỗi cặp doctorId và positionData.id. Nếu không có GROUP BY, dữ liệu sẽ trả về số cuộc hẹn
//từng cuộc hẹn riêng lẻ thay vì tổng hợp chúng lại.
// - Do đó, GROUP BY cần phải sử dụng để xác định các trường bạn muốn tổng hợp dữ liệu theo, trong trường hợp này là doctorId
//và positionData.id. Điều này giúp bạn trả về kết quả mà bạn mong muốn, tức là số lượng cuộc hẹn cho mỗi bác sĩ tại mỗi vị trí.

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ["passWord"], //không lấy passWord
                },
                where: { roleId: "R2" },
                include: [
                    {
                        model: db.Position,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"], //lấy ra
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: ["specialtyId"],
                        include: [
                            {
                                model: db.Specialty,
                                as: "specialtyData",
                                attributes: ["nameVi", "nameEn"], //lấy ra
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });

            if (doctors && doctors.length > 0) {
                doctors.map((item) => {
                    item.image = doctors.image = Buffer.from(
                        item.image,
                        "base64"
                    ).toString("binary");
                    return item;
                });
            }

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

//Validate data gửi lên
let checkRequiredFields = (inputData) => {
    let arr = [
        "doctorId",
        "contentHTML",
        "contentMarkdown",
        "action",
        "priceId",
        "paymentId",
        "provinceId",
        "specialtyId",
    ];

    let isValid = true;
    let element = "";

    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false;
            element = arr[i];
            break;
        }
    }

    return {
        isValid,
        element,
    };
};

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = checkRequiredFields(inputData);
            if (check.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Không tìm thấy ${check.element}!`,
                });
            } else {
                if (inputData.action === "CREATE") {
                    //upsert to Markdown
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === "EDIT") {
                    //Sửa dữ liệu
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false, //để dùng đc save() thì cần trả ra kiểu sequelize obj
                    });

                    if (markdown) {
                        markdown.contentHTML = inputData.contentHTML;
                        markdown.contentMarkdown = inputData.contentMarkdown;
                        markdown.description = inputData.description;
                        markdown.doctorId = inputData.doctorId;
                        markdown.updatedAt = new Date(); //lấy time hiện tại

                        await markdown.save();
                    }
                }

                //upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });

                if (doctorInfor) {
                    //update
                    doctorInfor.priceId = inputData.priceId;
                    doctorInfor.paymentId = inputData.paymentId;
                    doctorInfor.provinceId = inputData.provinceId;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    doctorInfor.updatedAt = new Date(); //lấy time hiện tại

                    await doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.priceId,
                        paymentId: inputData.paymentId,
                        provinceId: inputData.provinceId,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    });
                }

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
                            model: db.Position,
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
                                    model: db.Price,
                                    as: "priceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Payment,
                                    as: "paymentData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Province,
                                    as: "provinceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
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

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("check data bulkCreateSchedule: ", data);
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                let schedules = data.arrSchedule;
                if (schedules && schedules.length > 0) {
                    //Thêm thuộc tính để lưu vào csdl
                    schedules = schedules.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }
                // console.log("check data schedule send: ", schedules);

                //C1: Chuyển đổi định dạng ngày tháng cho dữ liệu gửi lên để cùng kiểu với server
                // const formattedDate = moment(data.date, "YYYY/MM/DD").format(
                //     "YYYY-MM-DD"
                // );

                //Tìm ra tất cả kiểu time của doctor trong ngày được gửi lên
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                    },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                    //chỉ lấy ra 4 trường do từ react gửi lên chỉ có 4 trường để dùng lodash so sánh
                    raw: true,
                });

                //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map((item) => {
                //         // item.date = moment(item.date).format("YYYY/MM/DD");
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     });
                // }

                //- Tìm ra sự khác biệt với dữ liệu đã có và dữ liệu gửi lên dựa trên timeType và date,
                //trả ra data của schedules khác so với existing
                let toCreate = _.differenceWith(schedules, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date == b.date;
                });

                // console.log("check data exist: ", existing);
                // console.log("check different ===================0");
                // console.log(toCreate);
                // console.log("check different ===================1");

                // //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
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

const getScheduleDoctorByDate = (doctorId, date) => {
    // console.log(doctorId, date);
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.TimeType,
                            as: "timeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.User,
                            as: "doctorData",
                            attributes: ["firstName", "lastName"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                // console.log(data);

                if (!data) {
                    data = [];
                }

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

const getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    include: [
                        {
                            model: db.Price,
                            as: "priceData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Payment,
                            as: "paymentData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Province,
                            as: "provinceData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                // console.log(data);

                if (!data) {
                    data = {};
                }

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

const getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ["passWord"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "contentHTML",
                                "contentMarkdown",
                                "description",
                            ],
                        },
                        {
                            model: db.Position,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Price,
                                    as: "priceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Province,
                                    as: "provinceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Payment,
                                    as: "paymentData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    //convert để trả image về kiểu base 64
                    data.image = new Buffer(data.image, "base64").toString(
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

const getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                //Lấy ra các booking đã được confirm
                let data = await db.Booking.findAll({
                    where: {
                        statusId: "S2",
                        doctorId: doctorId,
                        date: date,
                    },

                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: [
                                "email",
                                "lastName",
                                "address",
                                "birthday",
                                "gender",
                                "phoneNumber",
                            ],

                            include: [
                                {
                                    model: db.Gender,
                                    as: "genderData",
                                    attributes: ["valueVi", "valueEn"],
                                },
                            ],
                        },
                        {
                            model: db.TimeType,
                            as: "timeTypeDataPatient",
                            attributes: ["valueVi", "valueEn"],
                        },
                    ],

                    raw: true,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.patientId ||
                !data.timeType ||
                !data.date
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm tham số yêu cầu!",
                });
            } else {
                //update booking patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        date: data.date,
                        statusId: "S2",
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save();
                }

                //creqate history
                let history = await db.History.create({
                    doctorId: data.doctorId,
                    patientId: data.patientId,
                    bookingId: data.bookingId ? data.bookingId : null,
                    description: data.description ? data.description : null,
                    files: data.image ? data.image : null,
                });

                //send email
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    message: "Gửi hóa đơn khám bệnh thành công.",
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
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getTopDoctor,
    getListPatientForDoctor,
    sendRemedy,
};
//- Sequelize sẽ trả về kết quả truy vấn dưới dạng các đối tượng JavaScript thuần túy (plain JavaScript objects) thay vì các
//đối tượng Sequelize.

//- Khi bạn đặt nest: true, Sequelize sẽ tự động tạo các mối quan hệ giữa các đối tượng kết quả truy vấn dựa trên các mối quan hệ
//đã được định nghĩa trong mô hình dữ liệu của bạn.
//- Điều này có nghĩa rằng các đối tượng con được nhúng bên trong các đối tượng cha một cách tự động theo các mối quan hệ đã được
//định nghĩa trong mô hình dữ liệu.
//- Thường được sử dụng khi bạn muốn dễ dàng truy cập dữ liệu liên quan và có mối quan hệ giữa các bảng trong cơ sở dữ liệu của bạn.
