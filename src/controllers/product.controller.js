const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository

class ProductController {

  async addProduct(req, res) {
    const newProduct = req.body
    try {
      await productRepository.addProduct(newProduct)
      res.send({ status: "success", message: "Correctly aggregated product" })
    } catch (error) {
      if (error.message === "Product already exists") {
        res.status(409).json({ error: `${error.message}` })
      } else if (error.message === "Product missing fields") {
        res.status(409).json({ error: `${error.message}` })
      } else {
        res.status(500).json({ status: "error", message: "Internal Server Error" })
      }
    }
  }

  async getProducts(req, res) {
    const { limit, query, sort, page } = req.query
    try {
      const products = await productRepository.getProducts(limit, query, sort, page)
      res.send(products)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getProductById(req, res) {
    let pid = req.params.pid
    try {
      const product = await productRepository.getProductById(pid)
      res.send(product)
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async updateProduct(req, res) {
    const pid = req.params.pid
    const updatedProduct = req.body
    try {
      await productRepository.updateProduct(pid, updatedProduct)
      res.send({ status: "success", message: "Correctly updated product" })
    } catch (error) {
      res.status(409).json({ error: `${error.message}` })
    }
  }

  async deleteProduct(req, res) {
    const pid = req.params.pid
    try {
      await productRepository.deleteProduct(pid)
      res.send({ status: "success", message: `Product with id: ${pid} correctly deleted` })
    } catch (error) {
      res.status(409).json({ error: `${error.message}` })
    }
  }

}

module.exports = ProductController