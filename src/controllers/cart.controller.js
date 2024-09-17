const CartRepository = require("../repository/cartRepository.js")
const cartRepository = new CartRepository
const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository
const UserRepository = require("../repository/userRepository.js")
const userRepository = new UserRepository
const { generateUniqueCode, calculateTotal } = require("../utils/cartUtils.js")
const TicketService = require("../service/ticketService.js")
const ticketService = new TicketService
const EmailService = require("../service/emailService.js")
const emailService = new EmailService

class CartController {

  async getProductsByCartId(req, res,) {
    const { cid } = req.params
    try {
      const cartProducts = await cartRepository.getProductsByCartId(cid)
      res.status(200).json({status: "success", data: cartProducts})
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async addProduct(req, res, next) {
    const { cid, pid } = req.params
    const user = await userRepository.getUser({cartId: cid})
    const product = await productRepository.getProductById(pid)
    try {
      if (user.email === product.owner) {
        return res.status(403).json({status: "error", message: "You are the owner of this product. You cannot add it to the cart."})
      }
      const newProduct = await cartRepository.addProduct(cid, pid)
      res.status(200).json({ status: "success", message: "Successfully added to the cart.", data: newProduct })
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async deleteProductById(req, res, next) {
    const { cid, pid } = req.params
    try {
      const deleProduct = await cartRepository.deleteProductById(cid, pid)
      res.status(200).json({ status: "success", message: `Product correctly deleted from cart`, data: deleProduct })
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async updateCart(req, res, next) {
    const { cid } = req.params
    const updatedProducts = req.body
    try {
      const products = await cartRepository.updateCart(cid, updatedProducts)
      res.status(200).json({ status: "success", message: `Products correctly updated in cart`, data: products })
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async updateProductQuantity(req, res, next) {
    const { cid, pid } = req.params
    const quantity = req.body.quantity
    try {
      const products = await cartRepository.updateProductQuantity(cid, pid, quantity)
      res.status(200).json({ status: "success", message: `Product correctly updated in cart`, data: products })
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async deleteAllProducts(req, res, next) {
    const { cid } = req.params
    try {
      await cartRepository.deleteAllProducts(cid)
      res.status(200).json({ status: "success", message: `All products correctly deleted from cart` })
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }

  async purchase(req, res) {
    const cid = req.params.cid
    try {

      const cart = await cartRepository.getCartById(cid)

      const products = cart.products

      const notAvailable = []

      for (const item of products) {
        const productId = item.product
        const product = await productRepository.getProductById(productId)

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity
          await product.save()
        } else {
          notAvailable.push({ product: productId, quantity: item.quantity - product.stock })
          product.stock = 0
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
      await emailService.sendEmailPurchase(userWithCart.email, userWithCart.first_name,  newTicket.code)

      const purchaseData = {
        clientName: `${userWithCart.first_name} ${userWithCart.last_name}`,
        email: userWithCart.email,
        numTicket: newTicket.code,
        products,

      }

      res.status(200).json({ status: "success", message: "Purchase generated correctly", data: purchaseData})
  
    } catch (error) {
      res.status(error.statusCode).json({status: "error", message: error.message})
    }
  }
}

module.exports = CartController