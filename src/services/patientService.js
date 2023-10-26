import db from "../models/index";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";
import emailService from "./emailService";

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
                            redirectLink: buildUrlEmail(data.doctorId, token),
                        });

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

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
