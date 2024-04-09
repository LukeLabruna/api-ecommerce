const express = require("express")
const router = express.Router()
const UserModel = require("../../models/user.model")
const passport = require("passport")


router.post("register",
  passport.authenticate("register", {
    failureRedirect: "/user/failedregister"
  }),
  async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials")

    const { first_name, last_name, age, email } = req.user

    req.session.user = {
      email,
      name: `${first_name} ${last_name}`,
      age,
      role
    }

    req.session.login = true

    res.redirect("/profile")
  })


router.post("/login",
  passport.authenticate("login", {
    failureRedirect: "/user/failedlogin"
  }),
  async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials")

    const { first_name, last_name, age, email } = req.user

    req.session.user = {
      email,
      name: `${first_name} ${last_name}`,
      age,
      role
    }

    req.session.login = true

    res.redirect("/profile")
  })


router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy()
  }
  res.redirect("/user/login")
})

module.exports = router




