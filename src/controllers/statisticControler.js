// import statisticService from "../services/statisticService";
const statisticService = require("../services/statisticService");

let handleGetBookingCountsByMonth = async (req, res) => {
    try {
        let result = await statisticService.getBookingCountsByMonth();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleClinicMonthlyBookingStats = async (req, res) => {
    try {
        let result = await statisticService.clinicMonthlyBookingStats();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleCountStatsForAdmin = async (req, res) => {
    try {
        let result = await statisticService.countStatsForAdmin();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

module.exports = {
    handleGetBookingCountsByMonth,
    handleClinicMonthlyBookingStats,
    handleCountStatsForAdmin,
};
