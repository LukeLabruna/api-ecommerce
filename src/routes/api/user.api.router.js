const express = require("express")
const router = express.Router()
const UserController = require("../../controllers/user.controller.js")
const userController = new UserController
const upload = require("../../middleware/multer.js")
const checkUserRole = require("../../middleware/checkRole.js")

router.post("/register", userController.createUser)
router.post("/login", userController.userValidPassword)
router.post("/requestpasswordreset", userController.requestPasswordReset)
router.post("/resetpassword", userController.resetPassword)
router.post("/changerole/:uid", userController.changeRole)
router.post("/upload/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.uploadDocuments)
router.post("/logout", userController.logout)
router.delete("/delete/:uid", checkUserRole(["admin"]), userController.deleteUser)
router.delete("/deletedisconnectedusers", userController.deleteDisconnectedUsers)

module.exports = router