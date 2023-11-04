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
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyControler from "../controllers/specialtyControler";
import clinicControler from "../controllers/clinicControler";
import middlewareControler from "../controllers/middlewareControler";

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

    //Viết api cho user
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUser); //http://localhost:8080/api/get-all-users?id=1
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user/:id", userController.handleEditUser);
    router.delete("/api/delete-user/:id", userController.handleDeleteUser); //restAPI
    router.get("/api/allcode", userController.handleGetAllCode);

    //Viết api cho doctor
    router.get("/api/top-doctor-home", doctorController.handleGetTopDoctorHome);
    router.get("/api/get-all-doctor", doctorController.handleGetAllDoctor);
    router.post(
        "/api/save-infor-doctor",
        doctorController.handlePostInforDoctor
    );
    router.get(
        "/api/get-detail-doctor-by-id",
        doctorController.handleGetDetailDoctorById
    );
    router.get("/api/get-top-doctor", doctorController.handleGetTopDoctor);

    //Viết api cho schedule
    router.post(
        "/api/bulk-create-schedule",
        doctorController.handleBulkCreateSchedule
    );
    router.get(
        "/api/get-schedule-doctor-by-date",
        doctorController.handleGetScheduleDoctorByDate
    );
    router.get(
        "/api/get-extra-infor-doctor-by-id",
        doctorController.handleGetExtraInforDoctorById
    );

    //Viết api đặt lịch
    router.get(
        "/api/get-profile-doctor-by-id",
        doctorController.handleGetProfileDoctorById
    );
    router.post(
        "/api/patient-book-appointment",
        patientController.handlePostBookAppointment
    );
    router.post(
        "/api/verify-book-appointment",
        patientController.handlePostVerifyBookAppointment
    );

    //Viết api quản lý chuyên khoa
    router.post(
        "/api/create-new-specialty",
        specialtyControler.handleCreateSpecialty
    );
    router.get(
        "/api/get-all-specialty",
        specialtyControler.handleGetAllSpecialty
    );
    //Viết api cho chi tiết chuyên khoa
    router.get(
        "/api/get-detail-specialty-by-id",
        specialtyControler.handleGetDetailSpecialtyById
    );

    //Viết api quản lý phòng khám
    router.post("/api/create-new-clinic", clinicControler.handleCreateClinic);
    router.get("/api/get-clinic", clinicControler.handleGetAllClinic);
    router.get(
        "/api/get-detail-clinic-by-id",
        clinicControler.handleGetDetailClinicById
    );

    //Viết api search HomePage
    router.get("/api/search-by-name", userController.handleSearchByName);
    router.get("/api/search", userController.handleGetDataSearch);

    //Viết api xác thực người dùng
    router.post(
        "/login2",
        middlewareControler.authenticateToken,
        userController.handleLogin2
    );

    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
