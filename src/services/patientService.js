// import db from "../models/index";
const db = require("../models/index");
require("dotenv").config();
// import { v4 as uuidv4 } from "uuid";
const uuidv4 = require("uuid").v4;
const Sequelize = require("sequelize");

// import { sequelize } from "../models/index";
const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");

// import emailService from "./emailService";
const emailService = require("./emailService");

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};
const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.date ||
                !data.doctorId ||
                !data.timeType ||
                !data.fullName
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let token = uuidv4(); //tạo ra một chuỗi ngẫu nhiên

                //nếu có thì trả về, không có thì tạo mới(defaults)
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                        address: data.address ? data.address : null,
                        phoneNumber: data.phoneNumber ? data.phoneNumber : null,
                        gender: data.gender ? data.gender : null,
                        lastName: data.fullName ? data.fullName : null,
                        birthday: data.birthDay ? data.birthDay : null,
                    },
                });
                // console.log("check user form postBookAppointment: ", user);

                //create a booking record
                if (user && user[0]) {
                    //nếu có lịch hẹn rồi thì không cho spam
                    let booking = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                        },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            reason: data.reason,
                        },
                    });

                    //Nếu tạo được booking thì mới cho gửi email
                    if (booking && booking[1] === true) {
                        await emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            token: token,
                            redirectLink: buildUrlEmail(data.doctorId, token),
                            addressClinic: data.addressClinic,
                        });

                        let schedule = await db.Schedule.findOne({
                            where: {
                                date: data.date,
                                timeType: data.timeType,
                                doctorId: data.doctorId,
                            },
                            raw: false,
                        });

                        if (schedule) {
                            schedule.currentNumber = schedule.currentNumber + 1;
                            schedule.save();
                        }

                        resolve({
                            errCode: 0,
                            message: "Đặt lịch hẹn thành công!",
                        });
                    }
                    resolve({
                        errCode: 2,
                        errMessage:
                            "Bạn đã có lịch hẹn với bác sĩ này ngày hôm nay thành công!",
                    });
                }

                resolve({
                    errCode: 0,
                    message: "Đặt lịch hẹn thành công!",
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },

                    raw: false, //để trả ra sequelize obj để dùng hàm save()
                });

                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        message: "Xác nhận lịch hẹn thành công!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:
                            "Lịch hẹn đã được xác nhận hoặc không tồn tại!",
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getBookingHistoryForPatient = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!patientId) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây, và mili giây về 0
                const currentTimeStamp = currentDate.getTime(); // Lấy thời gian

                let bookings = await db.Booking.findAll({
                    where: {
                        patientId: patientId,
                        statusId: "S2",
                        date: { [Sequelize.Op.gte]: currentTimeStamp },
                    },
                    attributes: ["reason", "date", "id"],
                    include: [
                        {
                            model: db.User,
                            attributes: ["firstName", "lastName"],
                            include: [
                                {
                                    model: db.Doctor_Infor,
                                    attributes: ["addressClinic"],
                                },
                            ],
                        },
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: ["firstName", "lastName"],
                        },
                        {
                            model: db.TimeType,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let bookingHistory = await db.History.findAll({
                    where: {
                        patientId: patientId,
                    },
                    include: [
                        {
                            model: db.Booking,
                            as: "bookingData",
                            attributes: ["reason", "date"],
                            include: [
                                {
                                    model: db.User,
                                    attributes: ["firstName", "lastName"],
                                    include: [
                                        {
                                            model: db.Doctor_Infor,
                                            attributes: ["addressClinic"],
                                        },
                                    ],
                                },
                                {
                                    model: db.User,
                                    as: "patientData",
                                    attributes: ["firstName", "lastName"],
                                },
                                {
                                    model: db.TimeType,
                                    as: "timeTypeDataPatient",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    message: "OK",
                    data: {
                        bookings,
                        bookingHistory,
                    },
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const lookUpBookingHistoryForPatient = (tokenBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!tokenBooking) {
                resolve({
                    errCode: 1,
                    errMessage: "Yêu cầu nhập mã đặt lịch được gửi về email!",
                });
            } else {
                let booking = await db.Booking.findAll({
                    where: {
                        token: tokenBooking,
                    },
                    attributes: ["reason", "date", "id", "statusId"],
                    include: [
                        {
                            model: db.User,
                            attributes: ["firstName", "lastName"],
                        },
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: ["firstName", "lastName"],
                        },
                        {
                            model: db.TimeType,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Status,
                            as: "statusData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.History,
                            as: "bookingData",
                            attributes: ["description"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    message: "OK",
                    data: {
                        booking,
                    },
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const cancleBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        id: id,
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = "S4";
                    appointment.save();

                    resolve({
                        errCode: 0,
                        message: "Hủy lịch hẹn thành công!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Lịch hẹn không tồn tại!",
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

const newReview = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.rating || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Chưa chọn đánh giá!",
                });
            } else {
                let review = await db.Review.create({
                    rating: data.rating,
                    doctorId: data.doctorId,
                    comment: data.comment ? data.comment : "",
                });

                let history = await db.History.findOne({
                    where: {
                        bookingId: data.bookingId,
                    },
                    raw: false,
                });

                if (history) {
                    history.reviewId = parseInt(review.id);
                    history.save();
                }

                resolve({
                    errCode: 0,
                    message: "Cảm ơn bạn vì sự phản hồi từ bạn!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getDoctorRating = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                const res = await db.Review.findOne({
                    attributes: [
                        [
                            Sequelize.fn("AVG", Sequelize.col("Review.rating")),
                            "averageRating",
                        ],
                    ],
                    where: {
                        doctorId: doctorId,
                    },
                });

                resolve({
                    errCode: 0,
                    data: res.averageRating ? res.averageRating : 0,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getReviews = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let comments = [];

            const query = `
            select Users.firstName, Users.lastName, Reviews.comment, Reviews.rating, Histories.createdAt
            from Histories
            inner join Reviews on Histories.reviewId = Reviews.id
            inner join Users on Histories.patientId = Users.Id
            where Histories.doctorId = ${doctorId};
          `;

            comments = await sequelize.query(query, {
                type: QueryTypes.SELECT,
            });

            resolve({
                errCode: 0,
                data: comments,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
    getBookingHistoryForPatient,
    lookUpBookingHistoryForPatient,
    cancleBooking,
    newReview,
    getDoctorRating,
    getReviews,
};
