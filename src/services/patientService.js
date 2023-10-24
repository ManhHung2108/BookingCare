import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";

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
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: "https://www.facebook.com/",
                });

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
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                        },
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

module.exports = {
    postBookAppointment,
};
