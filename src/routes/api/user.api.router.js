const express = require("express")
const router = express.Router()
const passport = require("passport")
const UserController = require("../../controllers/user.controller.js")
const userController = new UserController

router.post("/register", userController.createUser)
router.post("/login", userController.userValidPassword)
router.get("/logout", userController.logout)
router.get("/github", passport.authenticate("loginGithub", { scope: ["user:email"], session:false }), (req, res) => {})
router.get("/githubcallback", passport.authenticate("loginGithub", { failureRedirect: "/user/login" , session:false}), userController.githubcallback)
router.post("/requestPasswordReset", userController.requestPasswordReset)
router.post('/resetpassword', userController.resetPassword)

module.exports = router