const express = require("express")
const router = express.Router()
const { newCartManager } = require("../api/carts.api.router.js")

router.get("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    const cartProducts = await newCartManager.getProductsByCartId(cid)
    res.render("cart", {
      cartProducts: cartProducts,
      cid
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router