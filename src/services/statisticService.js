import { sequelize } from "../models/index";

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

            resolve({
                errCode: 0,
                message: "OK",
                data: {
                    resultsBooking,
                    resultsBookingCancle,
                },
            });
        } catch (error) {
            console.error("Error:", error);
            reject(error);
        }
    });
};

module.exports = {
    getBookingCountsByMonth,
};
