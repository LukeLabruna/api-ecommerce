const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products")
  }
  res.redirect("/user/login")
})

module.exports = router