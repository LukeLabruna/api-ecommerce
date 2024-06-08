const CartRepository = require("../repository/cartRepository.js")
const cartRepository = new CartRepository
const MessageModel = require("../models/message.model.js")
const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository
const UserDTO = require("../DTO/userDTO.js")
const TicketService = require("../service/ticketService.js")
const ticketService = new TicketService

class ViewController {

  async cartById(req, res) {
    const { cid } = req.params
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    try {
      const cartProducts = await cartRepository.getProductsByCartId(cid)
      req.logger.info("Rendering Cart page")
      res.render("cart", {
        cartProducts: cartProducts,
        cid,
        user: userDto
      })
    } catch (error) {
      req.logger.error(error)
    }
  }

  async chat(req, res) {
    const messages = await MessageModel.find()
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    req.logger.info("Rendering Chat page")
    res.render("chat", {
      messages: messages,
      user: userDto
    })
  }

  async home(req, res) {
    if (!req?.cookies["userToken"]) {
      return res.redirect("/user/login")
    }
    res.redirect("/products")
  }

  async productDetail(req, res) {
    const { pid } = req.params
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    try {
      const product = await productRepository.getProductById(pid)
      req.logger.info("Rendering Product Detail page")
      res.render("productDetail", { productDetail: product, user: userDto })
    } catch (error) {
      req.logger.error(error)
    }
  }

  async products(req, res) {
    const { limit, query, sort, page } = req.query
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    try {

      const products = await productRepository.getProducts(limit, query, sort, page)
      const prevLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : ""}page=${products.prevPage}`
      const nextLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : ""}page=${products.nextPage}`
      const status = products.docs.length > 0 ? "success" : "error"

      req.logger.info("Rendering Products page")
      res.render("home", {
        status,
        payload: products.docs,
        currentPage: products.page,
        totalPages: products.totalPages,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        prevLink,
        nextLink,
        query,
        sort,
        limit,
        user: userDto
      })
    } catch (error) {
      req.logger.error(error)
    }
  }

  async realTimeProducts(req, res) {
    const products = await productRepository.getProducts()
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    req.logger.info("Rendering Real Time Products page")
    res.render("realTimeProducts", { products: products.docs, user: userDto })
  }

  async userRegister(req, res) {
    if (req?.cookies["userToken"]) {
      req.logger.info("Rendering Profile page")
      return res.redirect("/profile")
    }
    req.logger.info("Rendering Register page")
    res.render("register")
  }

  async userLogin(req, res) {
    if (req?.cookies["userToken"]) {
      req.logger.info("Rendering Profile page")
      return res.redirect("/profile")
    }
    req.logger.info("Rendering Login page")
    res.render("login")
  }

  async userProfile(req, res) {
    try {
      const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.age, req.user.email, req.user.cartId)
      const isAdmin = req.user.role === 'admin'
      req.logger.info("Rendering Profile page")
      res.render("profile", { user: userDto, isAdmin })
    } catch (error) {
      req.logger.error(error)
      res.status(500).send('Internal Server Error')
    }
  }

  async checkout(req, res) {
    const { clientName, email, numTicket } = req.query
    try {
      const purchaseData = {
        clientName,
        email,
        numTicket: numTicket.toString()
      }
      const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.age, req.user.email, req.user.cartId)

      const ticket = await ticketService.getTicketById(numTicket)
      req.logger.info("Rendering Checkout page")
      res.render("checkout", {user: userDto, purchaseData, ticket})
    } catch (error) {
      req.logger.error(error)
      res.status(500).send('Internal Server Error')
    }
  }
}

module.exports = ViewController