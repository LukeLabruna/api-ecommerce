const express = require("express")
const router = express.Router()
const ProductService = require("../../service/productService.js")
const productService = new ProductService

router.get("/", async (req, res) => {
  const products = await productService.getProducts()
  res.render("realTimeProducts", { products: products.docs })
})

module.exports = router