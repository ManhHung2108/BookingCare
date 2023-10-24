require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, //true for 465, false for other ports
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"HealthBookings 👻" <HealthBookings@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === "en") {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You receive this email when you make an appointment on HealthBookings</p>
        <p>Information to schedule an appointment:</p>
        <div>
            <b>Time: ${dataSend.time}</b>
        </div>
        <div>
           <b>Doctor: ${dataSend.doctorName}</b>
        </div>
        <p>Please click on the link below to confirm and complete your appointment.</p>
        <div>
            <a href=${dataSend.redirectLink} target="blank">Confirm</a>
        </div>
        <div>
            Thank you very much, have a nice day!
        </div>
        
    `; // html body
    }
    if (dataSend.language === "vi") {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này khi đã đặt lịch khám trên HealthBookings</p>
        <p>Thông tin đặt lịch:</p>
        <div>
            <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
           <b>Bác sĩ: ${dataSend.doctorName}</b>
        </div>
        <p>Vui lòng click vào đường link dưới để xác nhận và hoàn tất lịch đặt khám.</p>
        <div>
            <a href=${dataSend.redirectLink} target="blank">Xác nhận</a>
        </div>
        <div>
            Xin chân thành cảm ơn, chúc bạn có một ngày vui vẻ!
        </div>
        
    `; // html body
    }

    return result;
};

module.exports = {
    sendSimpleEmail,
};
