const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const passport = require("passport")

router.get("/:pid",passport.authenticate("jwt", {session:false}), viewController.productDetail)

module.exports = router