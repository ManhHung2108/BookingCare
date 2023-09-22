import doctorService from "../services/doctorService";
let handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;

    if (!limit) {
        limit = 10;
    }
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        // console.log(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

let handleGetAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor();
        // console.log(doctors);
        res.status(200).json(doctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handlePostInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

module.exports = {
    handleGetTopDoctorHome,
    handleGetAllDoctor,
    handlePostInforDoctor,
    handleGetDetailDoctorById,
};
