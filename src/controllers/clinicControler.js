// import clinicService from "../services/clinicService";
const clinicService = require("../services/clinicService");
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

const handleEditClinic = async (req, res) => {
    try {
        let id = req.params.id;
        let updateData = req.body;
        let message = await clinicService.updateClinic(id, updateData);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleDeleteClinic = async (req, res) => {
    try {
        let id = req.params.id;
        let message = await clinicService.deleteClinic(id);

        res.status(200).json(message);
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

const handleSearchClinicByName = async (req, res) => {
    try {
        let result = await clinicService.searchClinicByName(
            req.query.search,
            req.query.lang
        );
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
    handleCreateClinic,
    handleGetAllClinic,
    handleGetDetailClinicById,
    handleEditClinic,
    handleDeleteClinic,
    handleSearchClinicByName,
};
