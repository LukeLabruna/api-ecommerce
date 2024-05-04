const CartService = require("../service/cartService.js")
const cartService = new CartService
const ProductService = require("../service/productService.js")
const productService = new ProductService

class CartController {

  async getProductsByCartId(req, res) {
    const { cid } = req.params
    try {
      let cartProducts = await cartService.getProductsByCartId(cid)
      res.send(cartProducts)
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async addProduct(req, res) {
    const { cid, pid } = req.params
    try {
      const existingProduct = await productService.getProductById(pid);
      if (existingProduct.status === "error") {
        return res.status(404).json({ status: "error", message: `${existingProduct.message}` });
      }
      await cartService.addProduct(cid, pid)
      res.json({ status: "success", message: "Correctly aggregated to cart" })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async deleteProductById(req, res) {
    const { cid, pid } = req.params
    try {
      await cartService.deleteProductById(cid, pid)
      res.json({ status: "success", message: `Product with id: ${pid} correctly deleted from cart with id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async updateCart(req, res) {
    const { cid } = req.params
    const updatedProducts = req.body
    try {
      await cartService.updateCart(cid, updatedProducts)
      res.send({ status: "success", message: `Products correctly updated in cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async updateProductQuantity(req, res) {
    const { cid, pid } = req.params
    const quantity = req.body.quantity
    try {
      await cartService.updateProductQuantity(cid, pid, quantity)
      res.json({ status: "success", message: `Product with Id: ${pid} correctly updated in cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async deleteAllProducts(req, res) {
    const { cid } = req.params
    try {
      await cartService.deleteAllProducts(cid)
      res.send({ status: "success", message: `All products correctly deleted from cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

}

module.exports = CartController