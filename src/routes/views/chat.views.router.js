const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const passport = require("passport")
const checkUserRole = require("../../middleware/checkRole.js")

router.get("/",checkUserRole(["user"]), passport.authenticate("jwt", {session:false}), viewController.chat)

module.exports = router