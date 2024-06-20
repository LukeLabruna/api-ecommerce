const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const checkUserRole = require("../../middleware/checkRole.js")


router.get("/:cid", checkUserRole(["user", "premium"]), viewController.cartById)

module.exports = router