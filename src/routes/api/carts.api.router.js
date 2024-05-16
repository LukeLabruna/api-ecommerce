const express = require("express")
const router = express.Router()
const CartController = require("../../controllers/cart.controller.js")
const cartController = new CartController

router.get("/:cid", cartController.getProductsByCartId)
router.post("/:cid/product/:pid", cartController.addProduct)
router.delete("/:cid/product/:pid", cartController.deleteProductById)
router.put("/:cid", cartController.updateCart)
router.put("/:cid/product/:pid", cartController.updateProductQuantity)
router.delete("/:cid", cartController.deleteAllProducts)
router.post('/:cid/purchase', cartController.purchase);

module.exports = router