const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const checkUserRole = require("../../middleware/checkRole.js")


router.get("/:cid", checkUserRole(["user"]), viewController.cartById)

module.exports = router