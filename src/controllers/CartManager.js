const CartModel = require("../models/cart.model.js")

class CartManager {

  async addCart() {
    try {
      const newCart = new CartModel({ products: [] })
      await newCart.save()
    } catch (error) {
      throw error
    }
  }


  async getProductsByCartId(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new Error(`Cart with Id: ${cid} not found`)
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
        throw new Error(`Cart with Id: ${cid} not found`);
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
        throw new Error(`Cart with Id: ${cid} not found`)
      }
      const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)
      if (productIndex === -1) {
        throw new Error(`Product with id ${pid} not found`)
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
        throw new Error(`Cart with Id: ${cid} not found`)
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
        throw new Error(`Cart with Id: ${cid} not found`)
      }
    } catch (error) {
      throw error
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new Error(`Cart with Id: ${cid} not found`)
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

      }
    }

    async updateCart(cid, updatedProducts) {
      try {
        const cart = await CartModel.findById(cid)
        if (!cart) {
            throw new Error(`Cart with Id: ${cid} not found`)
        }
        cart.products = updatedProducts
        cart.markModified('products')
        await cart.save()
    } catch (error) {
        throw error
    }
    }
}

module.exports = CartManager