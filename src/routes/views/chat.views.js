const express = require("express")
const router = express.Router()
const MessageModel = require("../../models/message.model.js")

router.get("/", async (req, res) => {
  const messages = await MessageModel.find()
  res.render("chat", { messages: messages })
})

module.exports = router