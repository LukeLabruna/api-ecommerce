const UserRepository = require("../repository/userRepository.js")
const userRepository = new UserRepository
const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { SECRET_KEY_TOKEN } = configObj

class UserController {

  async createUser(req, res) {
    const user = req.body
    try {
      const newUser = await userRepository.createUser(user)

      const token = jwt.sign({ user: newUser}, SECRET_KEY_TOKEN, { expiresIn: "24h" })

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
      const user = await userRepository.userValidPassword(email, password)
      
      const token = jwt.sign({ user }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true,
      })
      res.redirect("/user/profile")

    } catch (error) {
      res.send(error.message)
    }
  }

  async logout(req, res) {
    res.clearCookie("userToken")
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