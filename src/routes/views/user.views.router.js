const express = require("express")
const router = express.Router()
const passport = require("passport")
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController


router.get("/register", viewController.userRegister)
router.get("/login", viewController.userLogin)
router.get("/profile", passport.authenticate("jwt", {session:false}), viewController.userProfile)

module.exports = router