const UserModel = require("../models/user.model.js")
const CartRepository = require("./cartRepository.js")
const cartRepository = new CartRepository
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")

class UserRepository {

  async createUser(user) {
    try {
      const userExist = await UserModel.findOne({ email: user.email })

      if (userExist) {
        throw new Error(`Email already exists`)
      }

      const newCart = await cartRepository.addCart()

      const newUser = new UserModel({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: createHash(user.password),
        age: user.age,
        cartId: newCart._id,
        role: user.role
      })

      newUser.save()

      return newUser
    } catch (error) {
      throw error
    }
  }

  async readUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email })

      if (!user) {
        return null
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async userValidPassword(email, password) {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new Error("User not exist")
      }
      const isValid = await isValidPassword(password, user)
      if (!isValid) {
        throw new Error("Invalid password")
      }
      return user
    } catch (error) {
      throw error
    }
  }

  async getUser(query) {
    try {
      const user = await UserModel.findOne(query)
      if (!user) {
        throw new Error(`User not exist`)
      }
      return user
    } catch (error) {
      throw error
    }
  }

  async changeRole(uid, newRole) {
    try {
      const user = await UserModel.findByIdAndUpdate(uid, { role: newRole }, { new: true })
      if (!user) {
        throw new Error("The role could not be changed.")
      }
    } catch (error) {
      throw error
    }
  }

  async deleteUser(uid) {
    try {
      const user = await UserModel.findByIdAndDelete(uid)
      if (!user) {
        throw new Error(`User not found`)
      }
      return user
    } catch (error) {
      throw error
    }
  }

  async getDisconnectedUsers() {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    try {
      const result = await UserModel.find({
        role: "user",
        last_connection: { $lte: twoDaysAgo }
      })
      if(!result) {
        throw new Error("No users to delete")
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deletDisconnectedUsers() {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    try {
      const result = await UserModel.deleteMany({
        role: "user",
        last_connection: { $lte: twoDaysAgo }
      })
      if(!result) {
        throw new Error("No users to delete")
      }
      return result
    } catch (error) {
      throw error
    }
  }
}

module.exports = UserRepository