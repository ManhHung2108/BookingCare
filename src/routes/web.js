const express = require("express");

// import {
//     getHomePage,
//     getAboutPage,
//     getCRUD,
//     postCrud,
//     displayCRUD,
//     getEditCRUD,
//     putCRUD,
//     deleteCRUD,
// } from "../controllers/homeController";
// import userController from "../controllers/userController";
// import doctorController from "../controllers/doctorController";
// import patientController from "../controllers/patientController";
// import specialtyControler from "../controllers/specialtyControler";
// import clinicControler from "../controllers/clinicControler";
// import middlewareControler from "../controllers/middlewareControler";
// import statisticControler from "../controllers/statisticControler";

const {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
} = require("../controllers/homeController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const specialtyControler = require("../controllers/specialtyControler");
const clinicControler = require("../controllers/clinicControler");
const middlewareControler = require("../controllers/middlewareControler");
const statisticControler = require("../controllers/statisticControler");

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
    router.post("/api/change-password", userController.handleChangePassword);

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
    router.get(
        `/api/search-doctor-by-name`,
        doctorController.handleSearchDoctorByName
    );

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
    router.delete(
        `/api/delete-schedule/:id`,
        doctorController.handleDeleteSchedule
    );
    router.get(
        `/api/get-doctor-by-clinic`,
        doctorController.handleGetDoctorByClinic
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
    router.get(
        `/api/search-specialty-by-name`,
        specialtyControler.handleSearchSpecialtyByName
    );
    //Viết api cho chi tiết chuyên khoa
    router.get(
        "/api/get-detail-specialty-by-id",
        specialtyControler.handleGetDetailSpecialtyById
    );
    router.put(
        "/api/edit-specialty/:id",
        specialtyControler.handleEditSpecialty
    );
    router.delete(
        "/api/delete-specialty/:id",
        specialtyControler.handleDeleteSpecialty
    ); //restAPI

    //Viết api quản lý phòng khám
    router.post("/api/create-new-clinic", clinicControler.handleCreateClinic);
    router.get("/api/get-clinic", clinicControler.handleGetAllClinic);
    router.get(
        "/api/get-detail-clinic-by-id",
        clinicControler.handleGetDetailClinicById
    );
    router.put("/api/edit-clinic/:id", clinicControler.handleEditClinic);
    router.delete("/api/delete-clinic/:id", clinicControler.handleDeleteClinic); //restAPI
    router.get(
        `/api/search-clinic-by-name`,
        clinicControler.handleSearchClinicByName
    );

    //Viết api search HomePage
    router.get("/api/search-by-name", userController.handleSearchByName);
    router.get("/api/search", userController.handleGetDataSearch);

    //Viết api xác thực người dùng
    router.post("/api/login2", userController.handleLogin2);
    router.get(
        "/api/system-user-infor",
        middlewareControler.authenticateToken,
        (req, res) => {
            let userInfor = {
                id: req.user.id,
                userName: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };

            if (req.user.role === "R1") {
                userInfor.userType = "admin";
            }
            if (req.user.role === "R2") {
                userInfor.userType = "doctor";
            }

            res.status(200).json({
                errCode: 0,
                message: "User Infor",
                userInfor,
            });
        }
    );
    router.get(
        "/api/admin-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R1"]),
        (req, res) => {
            let userInfor = {
                id: req.user.id,
                userName: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };
            // Xử lý khi người dùng là admin

            res.status(200).json({
                errCode: 0,
                message: "Admin Dashboard",
                userInfor,
            });
        }
    );
    router.get(
        "/api/doctor-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R2"]),
        (req, res) => {
            res.status(200).json({
                errCode: 0,
                message: "Doctor Dashboard",
            });
        }
    );
    router.get(
        "/api/home-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R1", "R2"]),
        (req, res) => {
            res.status(200).json({
                errCode: 0,
                message: "Welcome to dashboard home.",
            });
        }
    );

    //Viết api quản lý bệnh nhân
    router.get(
        "/api/get-list-patient-for-doctor",
        doctorController.handleGetListPatientForDoctor
    );
    router.post("/api/send-remedy", doctorController.handleSendRemedy);

    //Viết api thống kê
    router.get(
        `/api/get-booking-count-by-month`,
        statisticControler.handleGetBookingCountsByMonth
    );
    router.get(
        `/api/clinics/monthly-booking-stats`,
        statisticControler.handleClinicMonthlyBookingStats
    );
    router.get(
        `/api/count-stats-for-admin`,
        statisticControler.handleCountStatsForAdmin
    );

    //api get infor
    router.get(`/api/get-infor-user`, userController.handleGetInforUser);

    //Viết api lấy ra lịch khám
    router.get(
        `/api/get-booking-history-for-patient`,
        middlewareControler.authenticateToken,
        patientController.handleGetBookingHistoryForPatient
    );
    router.get(
        `/api/look-up-booking-history-for-patient`,
        patientController.handleLookUpBookingHistoryForPatient
    );
    router.put(
        `/api/cancle-booking/:id`,
        patientController.handleCancleBooking
    );

    //Viết api cập nhập thông tin
    router.put(`/api/update-profile/:id`, userController.handleUpdateProfile);

    //Viết api lấy genders
    router.get(`/api/get-all-gender`, userController.handleGetAllGender);

    //Viết api đăng ký
    router.post(`/api/register`, userController.handleRegister);

    //Viết api đánh giá
    router.post(`/api/new-review`, patientController.handleNewReview);
    router.get(
        `/api/get-doctor-rating`,
        patientController.handleGetDoctorRating
    );
    router.get(`/api/get-reviews`, patientController.handleGetReviews);

    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
