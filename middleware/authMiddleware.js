const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Acess denied ! No token provided"
            })
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        next();


    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Acess denied ! Invalid token"
        })
    }


}

module.exports = authMiddleware;