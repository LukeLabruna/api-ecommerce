const CartModel = require("../models/cart.model.js")
const ProductModel = require("../models/product.model.js")
const HandleError = require("../utils/handleErrors.js")

class CartRepository {

  async addCart() {
    try {
      const newCart = new CartModel({ products: [] })
      await newCart.save()
      return newCart
    } catch (error) {
      throw new HttpError("Error adding cart", 500)
    }
  }

  async getCartById(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
        }
      return cart
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error retrieving cart", 500)
    }
  }


  async getProductsByCartId(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      if (cart.products.length === 0 ) {
        throw new HandleError("Cart is empty", 400)
      }
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error retrieving products from cart", 500);
    }
  }

  async addProduct(cid, pid, quantity = 1) {
    try {
      const cart = await CartModel.findById(cid)
      const product = await ProductModel.findById(pid)
      if (!product) {
        throw new HttpError("Product not found", 404)
      }
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      const productExists = cart.products.find(p => p.product._id.toString() === pid)
      if (productExists) {
        productExists.quantity += quantity
      } else {
        const newProduct = {
          product: pid,
          quantity
        }
        cart.products.push(newProduct)
      }
      cart.markModified("products")
      await cart.save()
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error adding product to cart", 500);
    }
  }

  async deleteProductById(cid, pid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)
      if (productIndex === -1) {
        throw new Error("Product not found")
      } else {
        cart.products.splice(productIndex, 1)
      }
      cart.markModified("products")
      await cart.save()
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error deleting product from cart", 500);
    }
  }

  async deleteAllProducts(cid) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      if (cart.products.length === 0) {
        throw new HandleError("Cart is already empty", 400)
      }
      cart.products = []
      cart.markModified("products")
      await cart.save()
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error deleting all products from cart", 500);
    }
  }

  async deleteCart(cid) {
    try {
      const cartDelete = await CartModel.findByIdAndDelete(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      return cartDelete
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error deleting cart", 500);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid)
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity
        cart.markModified("products")
        await cart.save()
      } else {
        throw new HandleError(`Product not found in Cart`, 404)
      }
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error updating product quantity", 500);
    }
  }

  async updateCart(cid, updatedProducts) {
    try {
      const cart = await CartModel.findById(cid)
      if (!cart) {
        throw new HandleError("Cart not found", 404)
      }
      cart.products = updatedProducts
      cart.markModified("products")
      await cart.save()
      return cart.products
    } catch (error) {
      throw error instanceof HandleError ? error : new HttpError("Error updating cart", 500);
    }
  }

}

module.exports = CartRepository