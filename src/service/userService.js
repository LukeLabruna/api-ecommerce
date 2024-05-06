const UserModel = require("../models/user.model.js")
const CartService = require("./cartService.js")
const cartService = new CartService
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")

class UserService {

  async createUser(user) {
    try {
      if (!user.first_name || !user.last_name || !user.email || !user.age) {
        throw new Error("All fields are required")
      }

      const userExist = await UserModel.findOne({ email: user.email })

      if (userExist) {
        throw new Error(`Email ${user.email} is already in use`)
      }

      const newCart = await cartService.addCart();

      const newUser = new UserModel({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: createHash(user.password),
        age: user.age,
        cartId: newCart._id
      })
  
      newUser.save()

      return newUser
    } catch (error) {
      throw error
    }
  }

  async readUserByEmail (email) {
    try {
      const user = await UserModel.findOne({ email })

      if (!user) {
        throw new Error("User not exist")
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async userValidPassword (email, password){
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error("User not exist")
      } else if (!isValidPassword(password, user)) {
        throw new Error("Invalid password")
      }

      return user
    } catch (error) {
      throw error
    }
  }
}

module.exports = UserService