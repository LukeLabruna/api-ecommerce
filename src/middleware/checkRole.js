const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { SECRET_KEY_TOKEN } = configObj
const UserDTO = require("../DTO/userDTO.js")

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.userToken

    if (token) {

        jwt.verify(token, SECRET_KEY_TOKEN, (err, decoded) => {
            if (err) {
                req.error = { status: "Invalid Token", message: "Access denied. Invalid Token." }
                res.render("error", { error: req.error })
            } else {
                const userRole = decoded.user.role
                if (allowedRoles.includes(userRole)) {
                    next()
                } else {
                    const { first_name, last_name, age, email, cartId, role, _id } = req.user
                    const userDto = new UserDTO(first_name, last_name, age, email, cartId, role, _id)
                    req.error = { status: "Invalid User", message: "Access denied. You do not have permission to access this page." }
                    res.render("error", { error: req.error, user: userDto })
                }
            }
        })
    } else {
        req.error = { status: "Token Not Provided", message: "Access denied. Token not provided." }
        res.render("error", { error: req.error })
    }
}

module.exports = checkUserRole