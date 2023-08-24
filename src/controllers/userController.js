import userService from "../services/userService";

const handleGetAllUser = async (req, res) => {
    let id = req.body.id; //All, id
    // console.log(id);

    //Validator trên server side
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Không tìm thấy tham số yêu cầu",
            users: [],
        });
    }

    let users = await userService.getAllUser(id);
    // console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users,
    });
};

const handleLogin = async (req, res) => {
    let email = req.body.email;
    let passWord = req.body.passWord;

    //check email có tồn tại không
    //so sánh mật khẩu gửi lên có tồn tại không
    //trả về userInfo
    //access_token: JWT json web token
    if (!email || !passWord) {
        return res.status(500).json({
            errCode: 1,
            message: "Tài khoản mật khẩu không được để trống.",
        });
    }

    let userData = await userService.handleUserLogin(email, passWord);

    //trả về dữ liệu
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

module.exports = {
    handleLogin,
    handleGetAllUser,
};
