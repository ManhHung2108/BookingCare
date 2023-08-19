import db from "../models/index";
import CRUDService from "../services/CRUDService";

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
    // console.log(req.body); //lấy ra tham số từ clien gửi lên
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("post crud from server");
};

module.exports = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
};
