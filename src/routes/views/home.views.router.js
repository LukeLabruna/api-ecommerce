const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/", passport.authenticate("jwt", {session:false}), (req, res) => {
  if (req.user) {
    return res.redirect("/products")
  }
  res.redirect("/user/login")
})

module.exports = router