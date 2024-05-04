const express = require("express")
const router = express.Router()
const CartService = require("../../service/cartService.js")
const cartService = new CartService 

router.get("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    const cartProducts = await cartService.getProductsByCartId(cid)
    res.render("cart", {
      cartProducts: cartProducts,
      cid
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router