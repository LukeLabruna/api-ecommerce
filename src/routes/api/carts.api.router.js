const express = require("express")
const router = express.Router()
const CartManager = require("../../controllers/CartManager.js")
const newCartManager = new CartManager()
const { newProductManager } = require("./products.api.router.js")

router.post("/", async (req, res) => {
  try {
    await newCartManager.addCart()
    res.send({ status: "success", message: "Correctly aggregated cart" })
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal Server Error" })
  }
})

router.get("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    let cartProducts = await newCartManager.getProductsByCartId(cid)
    res.send(cartProducts)
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params
  try {
  const existingProduct = await newProductManager.getProductById(pid);
    if (existingProduct.status === "error") {
      return res.status(404).json({status:"error", message: `${existingProduct.message}` });
    }
    await newCartManager.addProduct(cid, pid)
    res.json({ status: "success", message: "Correctly aggregated to cart" })
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.delete("/:cid/product/:pid", async (req, res) => {
  const {cid, pid} = req.params
  try {
    await newCartManager.deleteProductById(cid, pid)
    res.json({ status: "success", message: `Product with id: ${pid} correctly deleted from cart with id: ${cid}` })
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.put("/:cid", async (req, res) => {
  const { cid } = req.params
  const updatedProducts = req.body
  try {
    await newCartManager.updateCart(cid, updatedProducts)
    res.send({status: "success", message: `Products correctly updated in cart with Id: ${cid}`})
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params
  const quantity = req.body.quantity
  try {
    await newCartManager.updateProductQuantity(cid, pid, quantity)
    res.json({status: "success", message: `Product with Id: ${pid} correctly updated in cart with Id: ${cid}`})
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params
  try {
    await newCartManager.deleteAllProducts(cid)
    res.send({ status: "success", message: `All products correctly deleted from cart with Id: ${cid}`})
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

module.exports = { router, newCartManager }