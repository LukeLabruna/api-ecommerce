import express from "express"
import { ProductManager } from "./ProductManager.js"

const app = express()
const newProductManager = new ProductManager("./src/productManager.json")
const PORT = 8080
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
  const products = await newProductManager.getProducts()
  let limit = parseInt(req.query.limit)
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts)
    return
  }
  res.send(products)
})

app.get("/products/:pid", async (req, res) => {
  let pid = req.params.pid
  const product = await newProductManager.getProductById(pid)
  if (!product) {
    const error = {error: `Product Id: ${pid} not found`}
    res.send(error)
  }
  res.send(product)
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

