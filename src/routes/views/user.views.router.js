const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/register", (req, res) => {
  res.render("register")
})

router.get("/login", passport.authenticate("jwt", {session:false}), (req, res) => {
  if (req.user) {
    return res.redirect("/products")
  }
  res.render("login")
})

router.get("/profile", passport.authenticate("jwt", {session:false}), (req, res) => {
  if (req.user) {
    return res.render("profile", {user: req.user})
  }
  res.redirect("/user/login")
})

// router.get("/failedlogin", (req, res) => {
//   res.render("failedLogin")
// })

// router.get("/failedregister", (req, res) => {
//   res.render("failedRegister")
// })

module.exports = router