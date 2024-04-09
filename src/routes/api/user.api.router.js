const express = require("express")
const router = express.Router()
const UserModel = require("../../models/user.model")
const passport = require("passport")


router.post("/register",
  passport.authenticate("register", {
    failureRedirect: "/user/failedregister"
  }),
  async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials")

    const { first_name, last_name, email, role } = req.user

    req.session.user = {
      email,
      name: `${first_name} ${last_name}`,
      role
    }
    req.session.login = true

    res.redirect("/user/profile")
  })


router.post("/login",
  passport.authenticate("login", {
    failureRedirect: "/user/failedlogin"
  }),
  async (req, res) => {

    if (!req.user) return res.status(400).send("Invalid credentials")

    const { first_name, last_name, email, role } = req.user

    req.session.user = {
      email,
      name: `${first_name} ${last_name}`,
      role
    }
    req.session.login = true

    res.redirect("/user/profile")
  })




router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy()
  }
  res.redirect("/user/login")
})

router.get("/github", passport.authenticate("loginGithub", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("loginGithub", {failureRedirect:"/user/login"}), async (req, res) => {

    req.session.user = {
      email: req.user.email,
      name: `${req.user.first_name} ${req.user.last_name}`,
      role: req.user.role
    }
    req.session.login = true

    res.redirect("/user/profile")
})


module.exports = router