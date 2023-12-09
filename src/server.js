// import express from "express";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// import bodyParser from "body-parser"; //hỗ trợ lấy tham số client gửi lên vd: /user?id=7
// import configViewEngine from "./config/viewEngine";
const configViewEngine = require("./config/viewEngine");
const initWebRoutes = require("./routes/web");
const connectDB = require("./config/connectDB");
// import initWebRoutes from "./routes/web";
// import connectDB from "./config/connectDB";
// import cors from "cors";
require("dotenv").config(); //để có thể sử dụng lệnh process.env

//Tạo ra ứng dụng express
const app = express();

//cho phép nhận yêu cầu từ tất cả các miền và phải đặt trước các route
app.use(cors({ origin: true }));

// Add headers before the routes are defined
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

//     // Request methods you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );

//     // Request headers you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "X-Requested-With,content-type"
//     );

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader("Access-Control-Allow-Credentials", true);

//     // Pass to next layer of middleware
//     next();
// });

//config app:

//chuyển request và respone về json để dễ thao tác
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

configViewEngine(app);
initWebRoutes(app);

//trước khi app chạy phải connect đến DB
connectDB();

//khởi chạy app
let port = process.env.PORT || 6969; //lấy ra trong file .env nếu PORT === undefined thì chạy cổng 6969

app.listen(port, () => {
    console.log(
        `Ứng dụng đã được chạy trên port ${port}, http://localhost:${port}`
    );
});
