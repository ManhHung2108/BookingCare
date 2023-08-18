import db from "../models/index";
const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log("--------------------");
        // console.log(JSON.stringify(data, null, 2));
        // console.log("--------------------");

        return res.render("homePage.ejs", {
            data: JSON.stringify(data),
            //chuyển thành chuỗi string
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

module.exports = {
    getHomePage,
    getAboutPage,
};
