const express = require("express")
const router = express.Router()
const { newProductManager } = require("../api/products.api.router.js")

router.get("/:pid", async (req, res) => {
  const { pid } = req.params
  try {
    const product = await newProductManager.getProductById(pid)
    res.render("productDetail", { productDetail: product })
  } catch (error) {
    console.log(error)
    // res.render("error", error)
  }
})

module.exports = router