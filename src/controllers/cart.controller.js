const CartRepository = require("../repository/cartRepository.js")
const cartRepository = new CartRepository
const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository
const UserRepository = require("../repository/userRepository.js")
const userRepository = new UserRepository
const { generateUniqueCode, calculateTotal } = require("../utils/cartUtils.js")
const TicketService = require("../service/ticketService.js")
const ticketService = new TicketService

class CartController {

  async getProductsByCartId(req, res) {
    const { cid } = req.params
    try {
      let cartProducts = await cartRepository.getProductsByCartId(cid)
      res.send(cartProducts)
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async addProduct(req, res) {
    const { cid, pid } = req.params
    try {
      const existingProduct = await productRepository.getProductById(pid);
      if (existingProduct.status === "error") {
        return res.status(404).json({ status: "error", message: `${existingProduct.message}` });
      }
      await cartRepository.addProduct(cid, pid)
      res.json({ status: "success", message: "Correctly aggregated to cart" })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async deleteProductById(req, res) {
    const { cid, pid } = req.params
    try {
      await cartRepository.deleteProductById(cid, pid)
      res.json({ status: "success", message: `Product with id: ${pid} correctly deleted from cart with id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async updateCart(req, res) {
    const { cid } = req.params
    const updatedProducts = req.body
    try {
      await cartRepository.updateCart(cid, updatedProducts)
      res.send({ status: "success", message: `Products correctly updated in cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async updateProductQuantity(req, res) {
    const { cid, pid } = req.params
    const quantity = req.body.quantity
    try {
      await cartRepository.updateProductQuantity(cid, pid, quantity)
      res.json({ status: "success", message: `Product with Id: ${pid} correctly updated in cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async deleteAllProducts(req, res) {
    const { cid } = req.params
    try {
      await cartRepository.deleteAllProducts(cid)
      res.send({ status: "success", message: `All products correctly deleted from cart with Id: ${cid}` })
    } catch (error) {
      res.status(404).json({ error: `${error.message}` })
    }
  }

  async purchase(req, res) {
    const cid = req.params.cid;
    try {

      const cart = await cartRepository.getCartById(cid)
      const products = cart.products

      const notAvailable = [];

      for (const item of products) {
        const productId = item.product
        const product = await productRepository.getProductById(productId)

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save()
        } else {
          notAvailable.push({ product: productId, quantity: item.quantity - product.stock });
          product.stock = 0;
          await product.save()
        }
      }

      const userWithCart = await userRepository.getUser({ cartId: cid })

      const newTicket = await ticketService.createTicket({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        products,
        amount: calculateTotal(products),
        purchaser: userWithCart._id
      })

      cart.products = notAvailable
      await cart.save()

      const purchaseData = {
        clientName: `${userWithCart.first_name} ${userWithCart.last_name}`,
        email: userWithCart.email,
        numTicket: newTicket._id
      }

      const queryString = new URLSearchParams(purchaseData).toString()

      res.redirect(`/checkout?${queryString}`)
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = CartController