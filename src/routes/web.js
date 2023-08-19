import express from "express";
import {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
} from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    //viết theo chuẩn rest api
    router.get("/", getHomePage);
    router.get("/about", getAboutPage);
    router.get("/crud", getCRUD);

    //chú ý gọi phương thức đúng ở đây là post
    router.post("/post-crud", postCrud);

    // router.get("/students", (req, res) => {
    //     return res.send("Trang students");
    // });

    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
