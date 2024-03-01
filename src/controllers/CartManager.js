const fsPromises = require('fs').promises

class CartManager {

  constructor(path) {
    this.path = path
    this.carts = null
  }

  async addCart() {
    try {
      if (this.carts === null) {
        await this.readCarts()
      }

      let maxId = this.carts.length > 0 ? Math.max(...this.carts.map(i => i.id)) : 0
      const id = maxId + 1

      const newCart = {
        id,
        products: []
      }
      this.carts.push(newCart)
      await this.writeCarts(this.carts)
    } catch (error) {
      throw error
    }
  }

  async readCarts() {
    try {
      const response = await fsPromises.readFile(this.path, "utf-8")
      const carts = JSON.parse(response)
      this.carts = carts
    } catch (error) {
      this.carts = []
    }
  }

  async writeCarts(newCarts) {
    try {
      await fsPromises.writeFile(this.path, JSON.stringify(newCarts, null, 2))
    } catch (error) {
      console.error("Carts could not be written", error)
    }
  }

  async getProductsByCartId(cid) {
    try {
      await this.readCarts()
      const cart = this.carts.find(i => i.id == cid)
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
      if (this.carts === null) {
        await this.readCarts()
      }

      const cart = this.carts.find(i => i.id == cid)

      if (!cart) {
        throw new Error(`Cart with Id: ${cid} not found`);
      }

      const existingProductIndex = cart.products.findIndex(i => i.productId == pid);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        const newProduct = {
          productId: parseInt(pid),
          quantity
        }
        cart.products.push(newProduct)
      }
      await this.writeCarts(this.carts)
    } catch (error) {
      throw error
    }
  }

  async deleteProductById(cid, pid) {
    try {
      await this.readCarts()
      const cartIndex = this.carts.findIndex(i => i.id == cid)
  
      if (cartIndex === -1) {
        throw new Error(`Cart with Id: ${cid} not found`)
      }
  
      const cart = this.carts[cartIndex]
      const productIndex = cart.products.findIndex(i => i.productId == pid)
  
      if (productIndex === -1) {
        throw new Error(`Product with id ${pid} not found`)
      }
  
      cart.products.splice(productIndex, 1)
  
      this.carts[cartIndex] = cart
  
      await this.writeCarts(this.carts)
    } catch (error) {
      throw error
    }
  }

  async deleteAllProducts(cid) {
    try {
      await this.readCarts()
      const cart = this.carts.find(i => i.id == cid)

      if (!cart) {
        throw new Error(`Cart with Id: ${cid} not found`)
      }
      if (cart.products.length === 0) {
        throw new Error(`Cart with Id: ${cid} is alredy empty`)
      }
      cart.products = []
      this.writeCarts(this.carts)
    } catch (error) {
      throw error
    }
  }

  async deleteCart(cid) {
    try {
      await this.readCarts()
      const cartToDeleteIndex = this.carts.findIndex(cart => cart.id == cid)
  
      if (cartToDeleteIndex === -1) {
        throw new Error(`Cart with Id: ${cid} not found`)
      }
  
      this.carts.splice(cartToDeleteIndex, 1)
  
      await this.writeCarts(this.carts)
    } catch (error) {
      throw error
    }
  }

}

module.exports = CartManager