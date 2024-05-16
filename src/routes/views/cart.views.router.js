const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController

router.get("/:cid", viewController.cartById)

module.exports = router