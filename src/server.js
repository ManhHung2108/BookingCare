import express from "express";
import bodyParser from "body-parser"; //hỗ trợ lấy tham số client gửi lên vd: /user?id=7
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config(); //để có thể sử dụng lệnh process.env

//Tạo ra ứng dụng express
const app = express();

//cho phép nhận yêu cầu từ tất cả các miền
app.use(cors({ origin: true }));

//config app:

//chuyển request và respone về json để dễ thao tác
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
