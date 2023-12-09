// import specialtyService from "../services/specialtyService";
const specialtyService = require("../services/specialtyService");
const handleCreateSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleEditSpecialty = async (req, res) => {
    try {
        let id = req.params.id;
        let updateData = req.body;

        let message = await specialtyService.updateSpecialty(id, updateData);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleDeleteSpecialty = async (req, res) => {
    try {
        let id = req.params.id;
        let message = await specialtyService.deleteSpecialty(id);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetAllSpecialty = async (req, res) => {
    try {
        let result = await specialtyService.getAllSpecialty();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleSearchSpecialtyByName = async (req, res) => {
    try {
        let result = await specialtyService.searchSpecialtyByName(
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

const handleGetDetailSpecialtyById = async (req, res) => {
    try {
        let specialty = await specialtyService.getDetailSpecialtyById(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(specialty);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

module.exports = {
    handleCreateSpecialty,
    handleGetAllSpecialty,
    handleGetDetailSpecialtyById,
    handleEditSpecialty,
    handleDeleteSpecialty,
    handleSearchSpecialtyByName,
};
