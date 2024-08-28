const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository

class ProductController {

  async addProduct(req, res, next) {
    const newProduct = req.body
    try {
      const response = await productRepository.addProduct(newProduct)
      res.status(201).json({ status: "success", message: "Correctly aggregated product", data: response })
    } catch (error) {
      res.status(409).json({status: "error", message: error.message})
    }
  }

  async getProducts(req, res) {
    const { limit, query, sort, page } = req.query
    try {
      const products = await productRepository.getProducts(limit, query, sort, page)
      res.status(200).json({status: "success", data: products})
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message })
    }
  }

  async getProductById(req, res, next) {
    let pid = req.params.pid
    try {
      const product = await productRepository.getProductById(pid)
      res.status(200).json({status: "success", data: product})
    } catch (error) {
      res.status(404).json({status: "error", message: error.message})
    }
  }

  async updateProduct(req, res, next) {
    const pid = req.params.pid
    const updatedProduct = req.body
    try {
      const product = await productRepository.updateProduct(pid, updatedProduct)
      res.status(200).json({ status: "success", message: "Correctly updated product", data: product})
    } catch (error) {
      res.status(404).json({status: "error", message: error.message})
    }
  }

  async deleteProduct(req, res, next) {
    const pid = req.params.pid
    try {
      const productToDelete = await productRepository.deleteProduct(pid)
      res.send({ status: "success", message: `Product with id: ${pid} correctly deleted`, data: productToDelete })
    } catch (error) {
      res.status(404).json({status: "error", message: error.message})
    }
  }

}

module.exports = ProductController