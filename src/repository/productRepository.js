const ProductModel = require("../models/product.model.js")
const EmailService = require("../service/emailService.js")
const emailService = new EmailService

class ProductRepository {

  async addProduct(product) {
    const {title, description, price, thumbnail, code, stock, category, status, owner} = product
    try {
      const productCodeExists = await ProductModel.findOne({code: code})
      if (productCodeExists) {
        throw new Error("Product with code already exists")
      }
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("All fields are required")
      }
      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnail: thumbnail || [],
        code,
        stock,
        category,
        status: status === false ? false : true,
        owner

      })
      
      await newProduct.save()
      return newProduct
    } catch (error) {
      throw error
    }
  }

  async getProducts(limit = 10, query, sort, page = 1 ) {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort
      }
      const queryOption = query ? {category : query} : {} 
      const products = await ProductModel.paginate( queryOption , options )
      if (products.docs.length === 0) {
        throw new Error("Products not found")
      }
      return products
    } catch (error) {
      throw error
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id)
      if (!product) {
        throw new Error("Product not found")
      }
      return product
    } catch (error) {
      throw error
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct)
      if (!updateProduct) {
        throw new Error("Product not found")
      }
      return updateProduct
    } catch (error) {
      throw error
    }
  }

  async deleteProduct(id) {
    try {
      const productToDelete = await ProductModel.findByIdAndDelete(id)
      if (!productToDelete) {
        throw new Error("Product not found")
      } else if (productToDelete.owner !== "admin") {
        await emailService.sendEmailDeleteProduct(productToDelete.owner, productToDelete.title)
      }
      return productToDelete
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProductRepository