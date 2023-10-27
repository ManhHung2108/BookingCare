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

module.exports = {
    handleCreateSpecialty,
};
