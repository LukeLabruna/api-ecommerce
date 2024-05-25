const CartModel = require("../models/cart.model.js")
const CustomError = require("../service/errors/customError.js")
const Errors = require("../service/errors/enumErrors.js")
const {
  generateNotFoundProductErrorInfo,
  generateInvalidId,
  generateNotFoundCartErrorInfo
} = require("../service/errors/infoErrors.js")

class CartRepository {

  async addCart() {
    try {
      const newCart = new CartModel({ products: [] })
      await newCart.save()
      return newCart
    } catch (error) {
      throw error
    }
  }

  async getCartById(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateNotFoundCartErrorInfo(),
          message: "Error when trying to found a cart",
          code: Errors.INVALID_ID,
        })
      }
      return cart
    } catch (error) {
      throw error
    }
  }


  async getProductsByCartId(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      return cart.products
    } catch (error) {
      throw error
    }
  }

  async addProduct(cid, pid, quantity = 1) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidIdCartErrorInfo(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      const productExists = cart.products.find(p => p.product._id.toString() === pid)
      if (productExists) {
        productExists.quantity += quantity;
      } else {
        const newProduct = {
          product: pid,
          quantity
        }
        cart.products.push(newProduct)
      }
      cart.markModified("products")
      await cart.save()
    } catch (error) {
      throw error
    }
  }

  async deleteProductById(cid, pid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)
      if (productIndex === -1) {
        throw CustomError.createError({
          name: "Not found Product",
          cause: generateNotFoundProductErrorInfo(),
          message: `Product with id ${pid} not found`,
          code: Errors.NOT_FOUND,
        })
      } else {
        cart.products.splice(productIndex, 1)
      }
      cart.markModified("products")
      await cart.save()
    } catch (error) {
      throw error
    }
  }

  async deleteAllProducts(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      if (cart.products.length === 0) {
        throw new Error(`Cart with Id: ${cid} is alredy empty`)
      }
      cart.products = []
      cart.markModified("products")
      await cart.save()
    } catch (error) {
      throw error
    }
  }

  async deleteCart(cid) {
    try {
      const cartDelete = await CartModel.findByIdAndDelete(cid)
      if (!cartDelete) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to delete a cart",
          code: Errors.INVALID_ID,
        })
      }
    } catch (error) {
      throw error
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid)
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity
        cart.markModified('products')
        await cart.save()
      } else {
        throw new Error(`Product with Id: ${cid} not found in Cart with Id: ${cid}`)
      }
    } catch (error) {
      throw error
    }
  }

  async updateCart(cid, updatedProducts) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: generateInvalidId(cid),
          message: "Error when trying to read a cart",
          code: Errors.INVALID_ID,
        })
      }
      cart.products = updatedProducts
      cart.markModified('products')
      await cart.save()
    } catch (error) {
      throw error
    }
  }

}

module.exports = CartRepository