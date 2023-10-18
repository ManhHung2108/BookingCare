import db from "../models/index";
require("dotenv").config();

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.date || !data.doctorId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy tham số yêu cầu!",
                });
            } else {
                //nếu có thì trả về, không có thì tạo mới(defaults)
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
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
