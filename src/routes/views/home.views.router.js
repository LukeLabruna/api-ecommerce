const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  if (!req?.cookies["userToken"]) {
    return res.redirect("/user/login")
  }
  res.redirect("/products")
})

module.exports = router