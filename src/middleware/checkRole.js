const jwt = require('jsonwebtoken')
const configObj = require("../config/env.config.js")
const { SECRET_KEY_TOKEN } = configObj

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.userToken;

    if (token) {
        jwt.verify(token, SECRET_KEY_TOKEN, (err, decoded) => {
            if (err) {
                res.status(403).json({status: "invalidToken", message: "Access denied. Invalid Token."});
            } else {
                const userRole = decoded.user.role
                if (allowedRoles.includes(userRole)) {
                    next()
                } else {
                    res.status(403).json({status: "invalidUser", message: "Access denied. You do not have permission to access this page."})
                }
            }
        })
    } else {
        res.status(403).json({status: "tokenNotProvided", message: "Access denied. Token not provided."});
    }
};

module.exports = checkUserRole;