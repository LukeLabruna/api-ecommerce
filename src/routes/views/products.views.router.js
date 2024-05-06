const express = require("express")
const router = express.Router()
const ViewController = require("../../controllers/view.controller.js")
const viewController = new ViewController
const passport = require("passport")

router.get("/", passport.authenticate("jwt", {session:false}), viewController.products)

module.exports = router
