const fsPromises = require('fs').promises

class ProductManager {

  constructor(path) {
    this.path = path
    this.products = null
  }

  async addProduct(product) {
    try {
      if (this.products === null) {
        await this.readProducts()
      }

      const productExists = this.products.some(i => i.code === product.code)

      if (productExists) {
        throw new Error("Product already exists")
      }

      if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
        throw new Error("Product missing fields")
      }

      let maxId = this.products.length > 0 ? Math.max(...this.products.map(i => i.id)) : 0
      const id = maxId + 1

      const newProduct = {
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail || [],
        code: product.code,
        stock: product.stock,
        category: product.category,
        status: product.status === false ? false : true,
        id
      }

      this.products.push(newProduct)
      await this.writeProducts(this.products)

      return ""

    } catch (error) {
      throw error
    }
  }

  async readProducts() {
    try {
      const response = await fsPromises.readFile(this.path, "utf-8")
      const products = JSON.parse(response)
      this.products = products
    } catch (error) {
      this.products = []
    }
  }

  async writeProducts(newProducts) {
    try {
      await fsPromises.writeFile(this.path, JSON.stringify(newProducts, null, 2))
    } catch (error) {
      console.error("Products could not be written", error)
    }
  }

  async getProducts() {
    await this.readProducts()
    return this.products
  }

  async getProductById(id) {
    try {
      await this.readProducts()
      const product = this.products.find(i => i.id === id)
      if (!product) {
        throw new Error(`Product with Id: ${id} not found`)
      }
      return product
    } catch (error) {
      throw error
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      await this.readProducts()
      const productIndex = this.products.findIndex(i => i.id == id)

      if (productIndex === -1) {
        throw new Error(`Product with Id: ${id} not found`)
      }

      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedProduct,
        id: this.products[productIndex].id
      };

      await this.writeProducts(this.products);

    } catch (error) {
      throw error
    }
  }

  async deleteProduct(id) {
    try {
      await this.readProducts()
      const productToDelete = this.products.find(product => product.id == id);
      if (!productToDelete) {
        throw new Error(`Product with id ${id} not found`);
      }
      const filteredProducts = this.products.filter(i => i.id != id)
      await this.writeProducts(filteredProducts)
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProductManager