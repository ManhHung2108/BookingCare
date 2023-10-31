import specialtyService from "../services/specialtyService";
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
};
