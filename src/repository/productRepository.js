const ProductModel = require("../models/product.model.js")
const CustomError = require("../service/errors/customError.js")
const Errors = require("../service/errors/enumErrors.js")
const {
  generateFieldProductErrorInfo,
  generateInvalidId,
  generateNotFoundProductErrorInfo,
  generateInvalidCodeProductErrorInfo,
} = require("../service/errors/infoErrors.js")

class ProductRepository {

  async addProduct(product) {
    const {title, description, price, thumbnail, code, stock, category, status, owner} = product
    try {
      const productCodeExists = await ProductModel.findOne({code: code})
      if (productCodeExists) {
        throw CustomError.createError({
          name: "Product with code already exists",
          cause: generateInvalidCodeProductErrorInfo(code),
          message: "Error when trying to create a product",
          code: Errors.INVALID_CODE,
        })
      }
      if (!title || !description || !price || !code || !stock || !category) {
        throw CustomError.createError({
          name: "All fields are required",
          cause: generateFieldProductErrorInfo(product),
          message: "Error when trying to create a product",
          code: Errors.ALL_FIELD_REQUIRED,
        })
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
      return products
    } catch (error) {
      throw error      
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id)
      if (!product) {
        throw CustomError.createError({
          name: "Not found Product",
          cause: generateNotFoundProductErrorInfo(),
          message: "Error when trying to found a product",
          code: Errors.NOT_FOUND,
        })
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
        throw CustomError.createError({
          name: "Invalid product ID",
          cause: generateInvalidId(id),
          message: "Error when trying to update a product",
          code: Errors.INVALID_ID,
        })
      }
    } catch (error) {
      throw error
    }
  }

  async deleteProduct(id) {
    try {
      const productToDelete = await ProductModel.findByIdAndDelete(id)
      if (!productToDelete) {
        throw CustomError.createError({
          name: "Invalid product ID",
          cause: generateInvalidId(id),
          message: "Error when trying to delete a product",
          code: Errors.INVALID_ID,
        })
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProductRepository