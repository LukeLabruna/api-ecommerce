const express = require("express")
const router = express.Router()
const ProductController = require("../../controllers/product.controller.js")
const productController = new ProductController()


router
  .route("/")
  .get(productController.getProducts)
  .post(productController.addProduct)

router
  .route("/:pid")
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct)

module.exports = router