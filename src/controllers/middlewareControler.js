const jwt = require("jsonwebtoken");
require("dotenv").config();

const middlewareControler = {
    //Xác thực
    authenticateToken: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json("You're not authenticated"); // Unauthorized
        }

        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid"); // Forbidden(Cấm)
            }

            req.user = user;
            next();
        });
    },

    // Middleware để kiểm tra quyền hạn
    authorize: (roles) => {
        return (req, res, next) => {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                res.status(403).json({ message: "Access forbidden." }); //Forbidden(Cấm)
            }
        };
    },
};

module.exports = middlewareControler;
