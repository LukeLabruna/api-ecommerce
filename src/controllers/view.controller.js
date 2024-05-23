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
      res.render("cart", {
        cartProducts: cartProducts,
        cid,
        user: userDto
      })
    } catch (error) {
      console.log(error)
    }
  }

  async chat(req, res) {
    const messages = await MessageModel.find()
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
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
      res.render("productDetail", { productDetail: product, user: userDto })
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }
  }

  async realTimeProducts(req, res) {
    const products = await productRepository.getProducts()
    const {first_name, last_name, age, email, cartId} = req.user
    const userDto = new UserDTO(first_name, last_name, age, email, cartId)
    res.render("realTimeProducts", { products: products.docs, user: userDto })
  }

  async userRegister(req, res) {
    if (req?.cookies["userToken"]) {
      return res.redirect("/profile")
    }
    res.render("register")
  }

  async userLogin(req, res) {
    if (req?.cookies["userToken"]) {
      return res.redirect("/profile")
    }
    res.render("login")
  }

  async userProfile(req, res) {
    try {
      const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.age, req.user.email, req.user.cartId)
      const isAdmin = req.user.role === 'admin'
      res.render("profile", { user: userDto, isAdmin })
    } catch (error) {
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
      res.render("checkout", {user: userDto, purchaseData, ticket})
    } catch (error) {
      res.status(500).send('Internal Server Error')
    }
  }
}

module.exports = ViewController