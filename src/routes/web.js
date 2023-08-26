import express from "express";
import {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
} from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    //viết theo chuẩn rest api
    router.get("/", getHomePage);
    router.get("/about", getAboutPage);

    router.get("/crud", getCRUD); //chuyển sang trang edit
    router.post("/post-crud", postCrud); //chú ý gọi phương thức đúng ở đây là post
    router.get("/get-crud", displayCRUD);
    router.get("/edit-crud", getEditCRUD);
    //Nhấn nút update sẽ cập nhập csdl và quay lại trang /get-crud
    router.post("/put-crud", putCRUD); //click form có method là post
    router.get("/delete-crud", deleteCRUD); //chỉ là thẻ a chuyển trang thì ta chỉ cần dùng get

    //Viết api
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUser); //http://localhost:8080/api/get-all-users?id=1
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user/:id", userController.handleDeleteUser); //restAPI

    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
