const express = require("express");
// const express = require("express"); //cú pháp cũ

let configViewEngine = (app) => {
    //sau lấy ảnh trên server chỉ được lấy trong thư mục public
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs"); //giúp chúng ta gõ được logic trong file html
    app.set("views", "./src/views"); //set đường link lấy view engine  này, tìm các file(phía client) ejs trong thư mục views này
};

module.exports = configViewEngine;
