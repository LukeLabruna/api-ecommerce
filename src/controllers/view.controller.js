const CartService = require("../service/cartService.js")
const cartService = new CartService
const MessageModel = require("../models/message.model.js")
const ProductService = require("../service/productService.js")
const productService = new ProductService

class ViewController {

  async cartById(req, res) {
    const { cid } = req.params
    try {
      const cartProducts = await cartService.getProductsByCartId(cid)
      res.render("cart", {
        cartProducts: cartProducts,
        cid
      })
    } catch (error) {
      console.log(error)
    }
  }

  async chat(req, res) {
    const messages = await MessageModel.find()
    res.render("chat", { messages: messages })
  }

  async home(req, res) {
    if (!req?.cookies["userToken"]) {
      return res.redirect("/user/login")
    }
    res.redirect("/products")
  }

  async productDetail(req, res) {
    const { pid } = req.params
    try {
      const product = await productService.getProductById(pid)
      res.render("productDetail", { productDetail: product })
    } catch (error) {
      console.log(error)
    }
  }

  async products(req, res) {
    const { limit, query, sort, page } = req.query
    const user = req.user
    try {

      const products = await productService.getProducts(limit, query, sort, page)
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
        user
      })
    } catch (error) {
      console.log(error)
    }
  }

  async realTimeProducts(req, res) {
    const products = await productService.getProducts()
    res.render("realTimeProducts", { products: products.docs })
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
    if (req.user) {
      return res.render("profile", {user: req.user})
    }
    res.redirect("/user/login")
  }
}

module.exports = ViewController