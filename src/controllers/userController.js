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

const handleLogin2 = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Tài khoản mật khẩu không được để trống.",
        });
    }

    let user = await userService.handleUserLogin2(username, password);
    res.status(200).json(user);
    if (!user) {
        return res
            .status(401)
            .json({ message: "Tên người dùng không tồn tại" });
    }
};

const handleGetInforUser = async (req, res) => {
    const { id } = req.query;
    try {
        let result = await userService.getInforUser(id);
        res.status(200).json(result);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
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

const handleSearchByName = async (req, res) => {
    try {
        let data = await userService.getDataByName(req.query.q);
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

const handleGetDataSearch = async (req, res) => {
    try {
        let data = await userService.getDataSearch();
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

const handleUpdateProfile = async (req, res) => {
    try {
        let id = req.params.id;
        const data = req.body;

        let result = await userService.updateProfile(id, data);
        return res.status(200).json(result);
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
    handleSearchByName,
    handleGetDataSearch,
    handleLogin2,
    handleGetInforUser,
    handleUpdateProfile,
};
