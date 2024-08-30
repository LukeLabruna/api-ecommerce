const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { SECRET_KEY_TOKEN } = configObj
const UserDTO = require("../DTO/userDTO.js")

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.userToken

    if (token) {

        jwt.verify(token, SECRET_KEY_TOKEN, (err, decoded) => {
            if (err) {
                res.status(403).json({ status: "error", message: "Access denied. Invalid Token." })
            } else {
                const userRole = decoded.user.role
                if (allowedRoles.includes(userRole)) {
                    next()
                } else {
                    console.log("token: ",token, "decoded: ", decoded)
                    res.status(401).json({ status: "error", message: "Access denied. Invalid User. You do not have permission to access this page." })
                }
            }
        })
    } else {
        res.status(404).json({ status: "error", message: "Access denied. Token not provided." })
    }
}

module.exports = checkUserRole