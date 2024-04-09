const express = require("express")
const router = express.Router()

router.get("/register", (req, res) => {
  res.render("register")
})

router.get("/login", async (req, res) => {
  if (req.session.login) {
    return res.redirect("/products")
  }
  res.render("login")
})

router.get("/logout", (req, res) => {
  if(req.session.login) {
      req.session.destroy();
  }
  res.redirect("/products");
})

router.get("/profile", (req, res) => {
  if (req.session.login) {
    return res.render("profile", {user: req.session.user})
  }
  res.redirect("/user/login")
})

router.get("/failedlogin", (req, res) => {
  res.render("failedLogin")
})

router.get("/failedregister", (req, res) => {
  res.render("failedRegister")
})

module.exports = router