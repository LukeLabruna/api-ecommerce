const express = require("express")
const router = express.Router()
const UserModel = require("../../models/user.model")

const isAdmin =  (req, res, next) => {
  const { email } = req.body
    if (email && email.endsWith("admin@coder.com")) {
      req.role = "admin"
    }
    next()
  }

router.post("/register", isAdmin, async (req, res) => {
  const {first_name, last_name, email, password, age} = req.body
  try {
    const userExist = await UserModel.findOne({email:email})
    if(userExist) {
      return res.status(400).json({status: "error", message: "The email is already registered"});
  }
  const newUser = await UserModel.create({first_name, last_name, email, password, age, role: req.role})
  req.session.login = true
  req.session.user = {...newUser._doc}
  res.redirect("/products")
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" })
  }
})

router.post("/login", async (req, res) => {
  const { email, password} = req.body
  try {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.login = true
      req.session.user = {
        email,
        role: "admin"
      }
      return res.redirect("/products")
    }
    const user = await UserModel.findOne({email:email})
    if (user) {
      if (user.password === password) {
        req.session.login = true
        req.session.user = {
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          age: user.age,
          role: user.role
        }
        res.redirect("/products")
      } else {
        res.status(401).json({ status: "error", message: "Invalid password" })
      }
    } else {
      res.status(404).json({ status: "error", message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" })
  }
})

router.get("/logout", (req, res) => {
  if(req.session.login) {
      req.session.destroy()
  }
  res.redirect("/user/login")
})

module.exports = router




