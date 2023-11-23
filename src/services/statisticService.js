import db from "../models/index";
import { sequelize } from "../models/index";
const Sequelize = require("sequelize");

const { QueryTypes } = require("sequelize");
const getBookingCountsByMonth = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            SELECT 
              DATE_FORMAT(FROM_UNIXTIME(date / 1000), '%Y-%m') AS month, 
              COUNT(*) AS quantity
            FROM 
              bookings
            GROUP BY 
                month
            ORDER BY 
                month;
          `;
            const query2 = `
            SELECT 
                DATE_FORMAT(FROM_UNIXTIME(date / 1000), '%Y-%m') AS month, 
                COUNT(*) AS quantity
            FROM bookings
                WHERE statusId = 'S4'
            GROUP BY month
            ORDER BY month;
          `;

            const resultsBooking = await sequelize.query(query, {
                type: QueryTypes.SELECT,
            });
            const resultsBookingCancle = await sequelize.query(query2, {
                type: QueryTypes.SELECT,
            });

            let data = resultsBooking.reduce((acc, booking) => {
                const matchingCancle = resultsBookingCancle.find(
                    (element) => element.month === booking.month
                );

                acc.push({
                    month: booking.month,
                    counts: booking.quantity ? booking.quantity : 0,
                    countsCancle: matchingCancle ? matchingCancle.quantity : 0,
                });

                return acc;
            }, []);

            console.log(data);

            resolve({
                errCode: 0,
                message: "OK",
                data: data,
            });
        } catch (error) {
            console.error("Error:", error);
            reject(error);
        }
    });
};

const clinicMonthlyBookingStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            SELECT 
	            DATE_FORMAT(FROM_UNIXTIME (date /  1000), '%Y-%m') AS thang, clinics.nameVi, clinics.nameEn,
	            COUNT(*) AS quantity
                FROM bookings
            inner join doctor_infors on doctor_infors.doctorId = bookings.doctorId
            inner join clinics on clinics.id = doctor_infors.clinicId
            WHERE 
                DATE_FORMAT(FROM_UNIXTIME(date/1000), '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
            GROUP BY thang, clinics.id
            ORDER BY thang, quantity DESC;
          `;

            const resultsBooking = await sequelize.query(query, {
                type: QueryTypes.SELECT,
            });

            resolve({
                errCode: 0,
                message: "OK",
                data: resultsBooking,
            });
        } catch (error) {
            console.error("Error:", error);
            reject(error);
        }
    });
};

const countStatsForAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let userCountStats = await db.User.count();
            let doctorCountStats = await db.User.count({
                where: {
                    roleId: "R2",
                },
            });
            let clinicCountStats = await db.Clinic.count();

            resolve({
                errCode: 0,
                data: {
                    userCountStats,
                    doctorCountStats,
                    clinicCountStats,
                },
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getBookingCountsByMonth,
    clinicMonthlyBookingStats,
    countStatsForAdmin,
};
