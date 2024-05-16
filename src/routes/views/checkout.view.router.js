const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const checkUserRole = require("../../middleware/checkRole.js")

router.get("/", checkUserRole(["user"]), viewController.checkout)

module.exports = router