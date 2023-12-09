// import db from "../models/index";
// import CRUDService from "../services/CRUDService";

const db = require("../models/index");
const CRUDService = require("../services/CRUDService");

const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log("--------------------");
        // console.log(JSON.stringify(data, null, 2));
        // console.log("--------------------");

        return res.render("homePage.ejs", {
            data: JSON.stringify(data),
            //gửi sang cho view
        });
        //không cần đường dẫn vì ta đã config tất cả file views sẽ nằm trong src/views
    } catch (error) {
        console.log(error);
    }
};
const getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
    //không cần đường dẫn vì ta đã config tất cả file views sẽ nằm trong src/views
};
const getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

//Tạo mới 1 user
let postCrud = async (req, res) => {
    //lấy ra tham số từ clien gửi lên, muốn nhận được thì ở html bắt buộc phải có biến input là name, form có action và method
    // console.log(req.body);
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send(message);
};

const displayCRUD = async (req, res) => {
    let listUser = await CRUDService.getAllUser();
    // console.log("listUser:", listUser);

    if (listUser) {
        return res.render("displayCRUD.ejs", {
            data: listUser,
        });
    } else {
        res.send("Not Found");
    }
};

// Trang edit?id=1
const getEditCRUD = async (req, res) => {
    // console.log(req.query.id); //get id on url
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        console.log("userInfo: ", JSON.stringify(userData, null, 2));
        // res.send(JSON.stringify(userData, null, 2)); //trả về json (API)
        res.render("editCRUD.ejs", {
            data: userData,
        });
    } else {
        res.send("Not Found!");
    }
};

const putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    //res.send("edit");

    //Khi cập nhập sau gọi render lại view
    return res.render("displayCRUD.ejs", {
        data: allUser,
    });
};

const deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    // console.log(userId);
    if (userId) {
        let allUser = await CRUDService.deleteUserById(userId);
        res.send("Delete user sucssed!");
        // return res.render("displayCRUD.ejs", {
        //     data: allUser,
        // });
    } else {
        return res.send("Not Found!");
    }
};

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
