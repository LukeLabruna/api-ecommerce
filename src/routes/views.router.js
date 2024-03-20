const express = require("express")
const router = express.Router()
const MessageModel = require("../models/message.model.js")
const { newProductManager } = require("./products.router.js")

router.get("/products", async (req, res) => {
  const {limit, query, sort, page } = req.query
  try {
  const products = await newProductManager.getProducts(limit, query, sort, page)

  const prevLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : "" }page=${products.prevPage}`
  const nextLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : "" }page=${products.nextPage}`

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
      limit
    })
  } catch (error) {
    console.log(error)
  }
})

router.get("/realTimeProducts", async (req, res) => {
  const products = await newProductManager.getProducts()
  res.render("realTimeProducts", {products: products.docs})
})

router.get("/chat", async (req, res) => {
  const messages = await MessageModel.find()
  res.render("chat", {messages: messages})
})

module.exports = router
