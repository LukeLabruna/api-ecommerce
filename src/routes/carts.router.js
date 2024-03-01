const express = require("express")
const router = express.Router()
const CartManager = require("../controllers/CartManager.js")
const newCartManager = new CartManager("./src/models/carts.json")
const { newProductManager } = require("./products.router.js")

router.post("/", async (req, res) => {
  try {
    await newCartManager.addCart()
    res.send({ status: "success", message: "Correctly aggregated cart" })
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal Server Error" })
  }
})

router.get("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid
    let cartProducts = await newCartManager.getProductsByCartId(cid)
    res.send(cartProducts)
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = req.params.cid
    let pid = req.params.pid

    const existingProduct = await newProductManager.getProductById(pid);
    if (!existingProduct) {
      return res.status(404).json({ error: `Product with ID ${pid} not found` });
    }

    await newCartManager.addProduct(cid, pid)
    res.send({ status: "success", message: "Correctly aggregated cart" })
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = req.params.cid
    let pid = req.params.pid
    await newCartManager.deleteProductById(cid, pid)
    res.send({ status: "success", message: `Product with id: ${pid} correctly deleted from cart with id: ${cid}` })
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.delete("/:cid/products", async (req, res) => {
  try {
    let cid = req.params.cid
    await newCartManager.deleteAllProducts(cid)
    res.send({ status: "success", message: `All products correctly deleted from cart with Id: ${cid}`})
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.delete("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid
    await newCartManager.deleteCart(cid)
    res.send({status: "success", message: `Cart with Id: ${cid} correctly deleted`})
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

module.exports = { router, newCartManager }