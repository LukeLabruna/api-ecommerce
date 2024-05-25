const express = require("express")
const router = express.Router()
const readMockingProducts = require("../../controllers/mockingproducts.controller.js")

router.get("/", readMockingProducts)

module.exports = router