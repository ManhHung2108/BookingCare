import userService from "../services/userService";

const handleGetAllUser = async (req, res) => {
    let id = req.query.id; //All, id
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

let handleCreateNewUser = async (req, res) => {
    let data = req.body;

    let message = await userService.createNewUser(data);
    // console.log(message);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let id = req.params.id;
    let updateData = req.body;
    let message = await userService.updateUser(id, updateData);

    res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Không tìm thấy tham số yêu cầu",
        });
    }

    let message = await userService.deleteUser(id);
    console.log(message);
    return res.status(200).json(message);
};

const handleGetAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCode(req.query.type); //là lấy tham số sau dấu ? http://localhost:8080/api/allcode?id=1
        return res.status(200).json(data);
    } catch (error) {
        console.log("Get all code error: ", error);
        //Khi không kết nối được thì chạy vào đây
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    handleGetAllCode,
};
