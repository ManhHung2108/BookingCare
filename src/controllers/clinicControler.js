import clinicService from "../services/clinicService";
const handleCreateClinic = async (req, res) => {
    try {
        let result = await clinicService.createClinic(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetAllClinic = async (req, res) => {
    try {
        let result = await clinicService.getAllClinic();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};
const handleGetDetailClinicById = async (req, res) => {
    try {
        let result = await clinicService.getDetailClinicById(
            req.query.id,
            req.query.location,
            req.query.search
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

module.exports = {
    handleCreateClinic,
    handleGetAllClinic,
    handleGetDetailClinicById,
};
