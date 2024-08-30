const UserRepository = require("../repository/userRepository.js")
const userRepository = new UserRepository
const jwt = require("jsonwebtoken")
const configObj = require("../config/env.config.js")
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")
const generateResetToken = require("../utils/generateResetToken.js")
const EmailService = require("../service/emailService.js")
const emailService = new EmailService
const { SECRET_KEY_TOKEN } = configObj
const UserDTO = require("../DTO/userDTO.js")

class UserController {

  async createUser(req, res) {
    const user = req.body
    try {
      const newUser = await userRepository.createUser(user)

      const token = jwt.sign({ user: {email: newUser.email, role: newUser.role} }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true
      })
      const userDTO = new UserDTO(user.first_name, user.last_name, user.age, user.email, user.cartId, user.role, user._id)
      res.status(200).json({ status: "success", message: "User created successfully", data: { user: userDTO, token: token } })
    } catch (error) {
      res.status(409).json({ status: "error", message: error.message })
    }
  }

  async userValidPassword(req, res) {
    const { email, password } = req.body
    try {
      const user = await userRepository.userValidPassword(email, password)

      const token = jwt.sign({ user: {email: user.email, role: user.role} }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      user.last_connection = new Date()
      await user.save()

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true,
      })

      const userDTO = new UserDTO(user.first_name, user.last_name, user.age, user.email, user.cartId, user.role, user._id)
      res.status(200).json({ status: "success", message: "User sign in successfully", data: { user: userDTO, token: token } })
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      } else if (error.message === "Invalid password") {
        return res.status(401).json({ status: "error", message: error.message })
      }
      res.status(500).json({status: "error", message: error.message})
    }
  }

  async logout(req, res) {
    if (req.user) {
      try {
        req.user.last_connection = new Date()
        await req.user.save()
        res.clearCookie("userToken")
        return res.status(200).json({status: "success", message: "User logout successfully"})
      } catch (error) {
        return res.status(500).json({status: "error", message: "Internal server error"})
      }
    }
    res.status(404).json({status: "error", message: "User not found"})
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body

    try {
      const user = await userRepository.readUserByEmail(email)

      const token = generateResetToken()

      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000)
      }
      await user.save()

      await emailService.sendMailResetPassword(email, user.first_name, token)

      res.status(200).json({ status: "success", message: "Password reset email sent successfully" })
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      }
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body

    try {

      const user = await userRepository.readUserByEmail(email)

      const resetToken = user.resetToken
      if (!resetToken || resetToken.token !== token) {
        return res.status(401).json({ status: "error", message: "Invalid token reset" })
      }

      const now = new Date()
      if (now > resetToken.expiresAt) {
        return res.status(401).json({ status: "error", message: "Token expired" })
      }

      if (await isValidPassword(password, user)) {
        return res.status(400).json({ status: "error", message: "The new password cannot be the same as the current password" })
      }

      user.password = createHash(password)
      user.resetToken = undefined
      await user.save()

      const userDTO = new UserDTO(user.first_name, user.last_name, user.age, user.email, user.cartId, user.role, user._id)
      return res.status(200).json({ status: "success", message: "Password changed correctly", data: userDTO })
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      }
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }

  async changeRole(req, res) {

    try {
      const { uid } = req.params

      const user = await userRepository.getUser({ _id: uid })

      const requiredDocuments = ["identification", "proofOfAddress", "proofOfAccount"]

      const userDocuments = user.documents.map(doc => doc.name)

      const hasDocuments = requiredDocuments.every(doc => userDocuments.includes(doc))

      if (user.role === "user" && !hasDocuments) {
        return res.status(400).json({ status: "error", message: "You must complete all documentation to become premium." })
      }

      const newRole = user.role === "user" ? "premium" : "user"

      const userUpdated = await userRepository.changeRole(uid, newRole)

      const token = jwt.sign({ user: {email: userUpdated.email, role: userUpdated.role} }, SECRET_KEY_TOKEN, { expiresIn: "24h" })

      res.cookie("userToken", token, {
        maxAge: 24 * 3600 * 1000,
        httpOnly: true
      })
      
      res.status(200).json({ status: "success", message: "Change user role successfully"})
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      }
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }

  async uploadDocuments(req, res) {

    const { uid } = req.params
    const uploadedDocuments = req.files

    try {
      const user = await userRepository.getUser({ _id: uid })

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
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      }
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }

  async deleteUser(req, res) {
    const { uid } = req.params
    try {
      const user = await userRepository.deleteUser(uid)
      await emailService.sendEmailDeleteUser(user.email, user.first_name)
      res.status(200).json({ status: "success", message: "User deleted successfully" })
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message })
      }
      res.status(500).json({ status: "error", message: "Internal server error" })
    }
  }


  async deleteDisconnectedUsers(req, res) {
    try {
      const result = await userRepository.deleteDisconnectedUsers()
      if (result.delete.deletedCount === 0) {
        return res.status(404).json({ status: "error", message: "Users not found" })
      }
      result.usersDisconected.forEach(async (user) => await emailService.sendEmailDeleteUser(user.email, user.first_name))
      res.status(200).json({ status: "success", message: `${result.delete.deletedCount} users deleted successfully`, data: result.usersDisconected })
    } catch (error) {
      res.status(500).json({ status: "error", message: `Internal server error` })
    }
  }

}

module.exports = UserController