const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository

class ProductController {

  async addProduct(req, res, next) {
    const newProduct = req.body
    try {
      await productRepository.addProduct(newProduct)
      res.send({ status: "success", message: "Correctly aggregated product" })
    } catch (error) {
      next(error)
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

  async getProductById(req, res, next) {
    let pid = req.params.pid
    try {
      const product = await productRepository.getProductById(pid)
      res.send(product)
    } catch (error) {
      next(error)
    }
  }

  async updateProduct(req, res, next) {
    const pid = req.params.pid
    const updatedProduct = req.body
    try {
      await productRepository.updateProduct(pid, updatedProduct)
      res.send({ status: "success", message: "Correctly updated product" })
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct(req, res, next) {
    const pid = req.params.pid
    try {
      await productRepository.deleteProduct(pid)
      res.send({ status: "success", message: `Product with id: ${pid} correctly deleted` })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = ProductController