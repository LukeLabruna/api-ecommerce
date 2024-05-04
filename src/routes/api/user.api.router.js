const express = require("express")
const router = express.Router()
const UserModel = require("../../models/user.model")
const passport = require("passport")
const { createHash, isValidPassword } = require("../../utils/hashBcrypt.js")
const jwt = require("jsonwebtoken")
require("dotenv").config()


// router.post("/register",
//   passport.authenticate("register", {
//     failureRedirect: "/user/failedregister"
//   }),
//   async (req, res) => {

//     if (!req.user) return res.status(400).send("Invalid credentials")

//     const { first_name, last_name, email, role, cartId } = req.user

//     req.session.user = {
//       email,
//       name: `${first_name} ${last_name}`,
//       role,
//       cartId
//     }
//     req.session.login = true

//     res.redirect("/user/profile")
//   })

router.post("/register", async (req, res) => {

  const { first_name, last_name, email, password, age } = req.user
  try {
    const userExist = await UserModel.findOne({ email })

    if (userExist) return res.json({ status: "error", message: "User already exists" })
    
    const newCart = await newCartManager.addCart()

    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      cartId: newCart._id
    })

    newUser.save()

    const token = jwt.sign({
      email: newUser.email,
      name: `${newUser.first_name} ${newUser.last_name}`,
      role: newUser.role,
      cartId: newUser.cartId
     }, process.env.SECRET_KEY_TOKEN, { expiresIn: "24h" })

    res.cookie("userToken", token, {
      maxAge: 24 * 3600 * 1000,
      httpOnly: true
    })

    res.redirect("/user/profile")

  } catch (error) {
    res.status(500).send(error)
  }
})


// router.post("/login",
//   passport.authenticate("login", {
//     failureRedirect: "/user/failedlogin"
//   }),
//   async (req, res) => {

//     if (!req.user) return res.status(400).send("Invalid credentials")

//     const { first_name, last_name, email, role, cartId } = req.user

//     req.session.user = {
//       email,
//       name: `${first_name} ${last_name}`,
//       role,
//       cartId
//     }
//     req.session.login = true

//     res.redirect("/user/profile")
//   })

router.post("/login", async (req, res) => {
  
  const { email, password} = req.body
  
  try {
    const userExist = await UserModel.findOne({ email })

    if (!userExist) return res.status(401).json({ status: "error", message: "User not exists" }) 

    if (!isValidPassword(password, userExist)) return res.status(401).json({ status:"error", message: "Invalid password"})

    const token = jwt.sign({
      email: userExist.email,
      name: `${userExist.first_name} ${userExist.last_name}`,
      role: userExist.role,
      cartId: userExist.cartId
     }, process.env.SECRET_KEY_TOKEN, { expiresIn: "24h" })

    res.cookie("userToken", token, {
      maxAge: 24 * 3600 * 1000,
      httpOnly: true,
    })

    res.redirect("/user/profile")

  } catch (error) {
    res.status(500).send(error)
  }
})


router.get("/logout", (req, res) => {
  res.clearCookie("userToken")
  res.status(200).send("Session closed successfully")
  res.redirect("/")
})

router.get("/github", passport.authenticate("loginGithub", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("loginGithub", { failureRedirect: "/user/login" }), async (req, res) => {

  const user = req.user

  const token = jwt.sign({ user },  process.env.SECRET_KEY_TOKEN, { expiresIn: "24h" } )

  es.cookie("userToken", token, {
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
  })

  res.redirect("/user/profile")
})


module.exports = router