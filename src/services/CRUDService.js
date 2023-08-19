import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10); //thuật toán sử dụng để hashPass

let createNewUser = async (data) => {
    // console.log("data from service: ", data);
    return new Promise(async (resolve, reject) => {
        //việc dùng promise để đảm bảo dữ liệu được tạo
        try {
            let hashPassWordFromByScript = await hashUserPassWord(
                data.passWord
            ); //lấy passWord đc hash promise trả về

            //map đến table User trong model, tạo mới bằng hàm create
            await db.User.create({
                email: data.email,
                passWord: hashPassWordFromByScript,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === "1" ? true : false, //kểu boolean
                roleId: data.roleId,
            });

            resolve("Create a new user success"); //resolve tương đương vs câu lệnh return
        } catch (error) {
            reject(error); //trả về lỗi
        }
    });
};

let getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true, //config ra log chỉ chứa data trong db
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassWord = (passWord) => {
    //Dùng promise để đảm bảo hàm luôn trả cho chúng ta tránh việc bất đồng bộ của js
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(passWord, salt); //chờ thư viện băm mật khẩu ra
            resolve(hashPassWord); //trả về
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
};
