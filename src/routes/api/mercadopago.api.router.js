const express = require("express")
const router = express.Router()
const MercadoPagoController = require("../../controllers/mercadopago.controller.js")
const mercadoPagoController = new MercadoPagoController

router.post("/create_preference", mercadoPagoController.createPreference)

module.exports = router