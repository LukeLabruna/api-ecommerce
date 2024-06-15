const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController


router.get("/register", viewController.userRegister)
router.get("/login", viewController.userLogin)
router.get("/profile", viewController.userProfile)
router.get("/requestpasswordreset", viewController.requestPasswordReset)
router.get("/confirmationsend", viewController.confirmationSend)
router.get("/resetpassword", viewController.resetPassword)

module.exports = router