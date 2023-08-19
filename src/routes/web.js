import express from "express";
import {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
    displayCRUD,
} from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    //viết theo chuẩn rest api
    router.get("/", getHomePage);
    router.get("/about", getAboutPage);
    router.get("/crud", getCRUD);

    router.post("/post-crud", postCrud); //chú ý gọi phương thức đúng ở đây là post
    router.get("/get-crud", displayCRUD);

    // router.get("/students", (req, res) => {
    //     return res.send("Trang students");
    // });

    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
