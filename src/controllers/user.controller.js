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
      if(error.message === "Email already exists"){
      return  res.render("failedRegister")
      }
      res.send("Internal server error")
    }
  }

  async userValidPassword(req, res) {
    const { email, password } = req.body
    try {
      const user = await userRepository.userValidPassword(email, password)

      const token = jwt.sign({ user }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      user.last_connection = new Date()
      await user.save()

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true,
      })
      res.redirect("/user/profile")

    } catch (error) {
      if(error.message === "User not exist" || error.message === "Invalid password") {
      return res.render("failedLogin")
      }
      res.send("Internal server error")
    }
  }

  async logout(req, res) {
    if (req.user) {
      try {
        req.user.last_connection = new Date()
        await req.user.save()
      } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error")
        return
      }
    }
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
      }
      await user.save()

      await emailService.sendMailResetPassword(email, user.first_name, token)

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
        return res.render("resetpassword", { user: "", error: "Invalid token reset" })
      }

      const now = new Date()
      if (now > resetToken.expiresAt) {
        return res.render("resetpassword", { user: "", error: "Token expired" })
      }

      if (await isValidPassword(password, user)) {
        return res.render("resetpassword", { user: "", error: "The new password cannot be the same as the current password" })
      }


      user.password = createHash(password)
      user.resetToken = undefined
      await user.save()

      return res.redirect("/user/login")
    } catch (error) {
      console.error(error)
      return res.status(500).render("resetpassword", { error: "Internal server error" })
    }
  }

  async changeRole(req, res) {

    try {
      const { uid } = req.params

      const user = await userRepository.getUser({ _id: uid })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const requiredDocuments = ["identification", "proofOfAddress", "proofOfAccount"]

      const userDocuments = user.documents.map(doc => doc.name)

      const hasDocuments = requiredDocuments.every(doc => userDocuments.includes(doc))

      if (user.role === "user" && !hasDocuments) {
        return res.status(400).send("You must complete all documentation to become premium.")
      }

      const newRole = user.role === "user" ? "premium" : "user"

      await userRepository.changeRole(uid, newRole)

      res.redirect("/user/profile")
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  async uploadDocuments(req, res) {

    const { uid } = req.params
    const uploadedDocuments = req.files

    try {
      const user = await userRepository.getUser({ _id: uid })

      if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" })
      }

      if (uploadedDocuments) {
        if (uploadedDocuments.document) {
          const documentMap = new Map(user.documents.map(doc => [doc.name, doc]));
          uploadedDocuments.document.forEach(doc => {
            const fileNameWithoutExt = doc.originalname.split(".").slice(0, -1).join(".")
            documentMap.set(fileNameWithoutExt, {
              name: fileNameWithoutExt,
              reference: doc.path
            })
          })
          user.documents = Array.from(documentMap.values())
        }

        if (uploadedDocuments.products) {
          user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
            name: doc.originalname,
            reference: doc.path
          })))
        }

        if (uploadedDocuments.profile) {
          user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
            name: doc.originalname,
            reference: doc.path
          })))
        }
      }

      await user.save()

      res.status(200).json({ status: "success", message: "Documents uploaded successfully" })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: "error", message: "Internal server error" })
    }

  }

  async deleteUser(req, res) {
    const {uid} = req.params
    try {
      const user = await userRepository.deleteUser(uid)

      if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" })
      }
      res.status(200).json({ status: "success", message: "User deleted successfully" })
    } catch (error) {
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }

  async deletDisconnectedUsers(req, res) {
    try {
      const result = await userRepository.deletDisconnectedUsers()
      if(result.deletedCount === 0) {
        return res.status(404).json({ status: "error", message: "Users not found" })
      }
      res.status(200).json({ status: "success", message: `${result.deletedCount} users deleted successfully` })
    } catch (error) {
      res.status(500).json({ status: "error", message: `Internal server error` })
    }
  }

}

module.exports = UserController