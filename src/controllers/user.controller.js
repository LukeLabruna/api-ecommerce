const UserService = require("../service/userService.js")
const userService = new UserService
const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { SECRET_KEY_TOKEN } = configObj

class UserController {

  async createUser(req, res) {
    const user = req.body
    try {
      const newUser = await userService.createUser(user)

      const token = jwt.sign({
        email: newUser.email,
        name: `${newUser.first_name} ${newUser.last_name}`,
        role: newUser.role,
        cartId: newUser.cartId
      }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true
      })

      res.redirect("/user/profile")
    } catch (error) {
      res.send(error)
    }
  }

  async userValidPassword(req, res) {
    const { email, password } = req.body
    try {
      const user = await userService.userValidPassword(email, password)

      const token = jwt.sign({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        cartId: user.cartId
      }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true,
      })

      res.redirect("/user/profile")

    } catch (error) {
      res.send(error)
    }
  }

  async logout(req, res) {
    res.clearCookie("userToken")
    res.status(200).send("Session closed successfully")
    res.redirect("/")
  }

  async githubcallback(req, res) {
    const user = req.user
    const token = jwt.sign({ user }, SECRET_KEY_TOKEN, { expiresIn: "24h" })
    res.cookie("userToken", token, {
      maxAge: 24 * 3600 * 1000,
      httpOnly: true,
    })

    res.redirect("/user/profile")
  }
}

module.exports = UserController