const UserRepository = require("../repository/userRepository.js")
const userRepository = new UserRepository
const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")
const generateResetToken = require("../utils/generateResetToken.js")
const EmailService = require("../service/emailService.js")
const emailService = new EmailService
const { SECRET_KEY_TOKEN } = configObj

class UserController {

  async createUser(req, res) {
    const user = req.body
    try {
      const newUser = await userRepository.createUser(user)

      const token = jwt.sign({ user: newUser }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

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

  async requestPasswordReset(req, res) {
    const { email } = req.body

    try {
      const user = await userRepository.readUserByEmail(email)
      if (!user) {
        return res.status(404).send("User not found")
      }

      const token = generateResetToken()

      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000)
      };
      await user.save()

      await emailService.sendMailResetPassword(email, user.first_name, token);

      res.redirect("/user/confirmationsend")
    } catch (error) {
      console.error(error)
      res.send(error)
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body

    try {
      
      const user = await userRepository.readUserByEmail(email)
      if (!user) {
        return res.status(404).send("User not found")
      }

      
      const resetToken = user.resetToken
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetpassword", { user: "", error: "Invalid token reset" });
      }

      const now = new Date();
      if (now > resetToken.expiresAt) {
        return res.render("resetpassword", { user: "", error: "Token expired" });
      }

      if (await isValidPassword(password, user)) {
        return res.render("resetpassword", { user: "", error: "The new password cannot be the same as the current password" });
      }

      
      user.password = createHash(password)
      user.resetToken = undefined
      await user.save()

      return res.redirect("/user/login");
    } catch (error) {
      console.error(error);
      return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  async changeRole(req, res) {
    try {
      const { uid } = req.params

      const user = await userRepository.getUser({_id: uid})

      if (!user) {
          return res.status(404).json({ message: "User not found" })
      }

      const newRole = user.role === "user" ? "premium" : "user"

      await userRepository.changeRole(uid, newRole)
    
      res.redirect("/user/profile")
  } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Internal server error" })
  }
  }

}

module.exports = UserController