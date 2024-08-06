const express = require("express")
const router = express.Router()
const passport = require("passport")
const UserController = require("../../controllers/user.controller.js")
const userController = new UserController
const upload = require("../../middleware/multer.js")

router.post("/register", userController.createUser)
router.post("/login", userController.userValidPassword)
router.get("/logout", userController.logout)
router.get("/github", passport.authenticate("loginGithub", { scope: ["user:email"], session:false }), (req, res) => {})
router.get("/githubcallback", passport.authenticate("loginGithub", { failureRedirect: "/user/login" , session:false}), userController.githubcallback)
router.post("/requestPasswordReset", userController.requestPasswordReset)
router.post("/resetpassword", userController.resetPassword)
router.post("/premium/:uid", userController.changeRole)
router.post("/premium/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.uploadDocuments)
router.delete("/delete/:uid", userController.deleteUser)
router.delete("/deletedisconnectedusers", userController.deletDisconnectedUsers)

module.exports = router