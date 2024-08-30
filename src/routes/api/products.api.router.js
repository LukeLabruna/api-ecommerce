const express = require("express")
const router = express.Router()
const ProductController = require("../../controllers/product.controller.js")
const productController = new ProductController()
const checkUserRole = require("../../middleware/checkRole.js")


router
  .route("/")
  .get(productController.getProducts)
  .post(checkUserRole(["admin"]), productController.addProduct)

router
  .route("/:pid")
  .get(productController.getProductById)
  .put(checkUserRole(["admin"]), productController.updateProduct)
  .delete(checkUserRole(["admin"]), productController.deleteProduct)

module.exports = router