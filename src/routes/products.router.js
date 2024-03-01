const express = require("express")
const router = express.Router()
const ProductManager = require("../controllers/ProductManager.js")
const newProductManager = new ProductManager("./src/models/products.json")

router.get("/", async (req, res) => {
  const products = await newProductManager.getProducts()
  let limit = parseInt(req.query.limit)
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts)
    return
  }
  res.send(products)
})

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid
  try {
    const product = await newProductManager.getProductById(pid)
    res.send(product)
  } catch (error) {
    res.status(404).json({ error: `${error.message}` })
  }
})

router.post("/", async (req, res) => {
  const newProduct = req.body
  try {
    await newProductManager.addProduct(newProduct)
    res.send({status: "success", message: "Correctly aggregated product"})
  } catch (error) {
    if (error.message === "Product already exists") {
      res.status(409).json({ error: `${error.message}` })
    } else if (error.message === "Product missing fields") {
      res.status(409).json({ error: `${error.message}` })
    } else {
      res.status(500).send({ status: "error", message: "Internal Server Error" })
    }
  }
})

router.put("/:pid", async (req, res) => {
  let pid = req.params.pid
  const updatedProduct = req.body
  try {
    await newProductManager.updateProduct(pid, updatedProduct)
    res.send({status: "success", message: "Correctly updated product"})
  } catch (error) {
    res.status(409).json({ error: `${error.message}` })
  }
})

router.delete("/:pid", async (req, res) => {
  let pid = req.params.pid
  try {
    await newProductManager.deleteProduct(pid)
    res.send({status: "success", message: `Product with id: ${pid} correctly deleted`})
  } catch (error) {
    res.status(409).json({ error: `${error.message}` })
  }
})

module.exports = { newProductManager, router }