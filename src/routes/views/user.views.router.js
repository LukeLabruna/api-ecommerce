const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController


router.get("/register", viewController.userRegister)
router.get("/login", viewController.userLogin)
router.get("/profile", viewController.userProfile)

module.exports = router