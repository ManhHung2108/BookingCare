import specialtyService from "../services/specialtyService";
const handleCreateSpecialty = async (req, res) => {
    try {
        let res = await specialtyService.createSpecialty;
        return res.status(200).json(res);
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
