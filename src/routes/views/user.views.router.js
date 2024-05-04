const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/register", (req, res) => {
  if (req?.cookies["userToken"]) {
    return res.redirect("/profile")
  }
  res.render("register")
})

router.get("/login", (req, res) => {
  if (req?.cookies["userToken"]) {
    return res.redirect("/profile")
  }
  res.render("login")
})

router.get("/profile", passport.authenticate("jwt", {session:false}), (req, res) => {
  if (req.user) {
    return res.render("profile", {user: req.user})
  }
  res.redirect("/user/login")
})

module.exports = router