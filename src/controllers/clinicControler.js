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
module.exports = {
    handleCreateClinic,
};
