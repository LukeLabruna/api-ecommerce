const express = require("express")
const router = express.Router()
const MessageModel = require("../models/message.model.js")
const { newProductManager } = require("./products.router.js")

router.get("/", async (req, res) => {
  try {
    const products = await newProductManager.getProducts()
    let limit = parseInt(req.query.limit)
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.render("home", {
        products: limitedProducts
      })
      return
    }
    res.render("home", {
      products: products
    })
  } catch (error) {
    res.render("error", {
      message: error
    })
  }
})

router.get("/realTimeProducts", async (req, res) => {
  const products = await newProductManager.getProducts()
  res.render("realTimeProducts", {products: products})
})

router.get("/chat", async (req, res) => {
  const messages = await MessageModel.find()
  console.log(messages)
  res.render("chat", {messages: messages})
})

module.exports = router