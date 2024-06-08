const express = require("express")
const router = express.Router()
const loggerController = require("../../controllers/logger.controller")

router.get("/", loggerController)

module.exports = router