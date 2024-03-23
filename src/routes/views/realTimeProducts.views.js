const express = require("express")
const router = express.Router()
const { newProductManager } = require("../api/products.api.router.js")

router.get("/", async (req, res) => {
  const products = await newProductManager.getProducts()
  res.render("realTimeProducts", { products: products.docs })
})

module.exports = router