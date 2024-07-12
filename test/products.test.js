const mongoose = require("mongoose")
const assert = require('assert')
// const chai = import("chai")
// const expect = chai.expect
const configObj = require("../src/config/env.config.js")
const { USER_MONGO, PASSWORD_MONGO, DB_MONGO } = configObj

const ProductRepository = require("../src/repository/productRepository.js")

describe("Testing Products", () => {
  before(() => {
    mongoose.connect(`mongodb+srv://${USER_MONGO}:${PASSWORD_MONGO}@cluster0.ud53fbh.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority&appName=Cluster0`)
    this.productRepository = new ProductRepository()
  })

  beforeEach(() => {
    mongoose.connection.collections.products.drop()
  })


  it("Create Product", async () => {
    // this.timeout(5000)
    const newProduct = {
      title: "some product",
        description: "some product",
        price: 1234,
        thumbnail: [],
        code: "ABC123",
        stock: 1234,
        category: "some category",
        status: true,
        owner: "admin"
    }

    const result = await this.productRepository.addProduct(newProduct)
    assert.ok(result._id); 
  })

  it("Get Product by Id", async () => {
    // this.timeout(5000)
    mongoose.connection.collections.products.drop()
    const newProduct = {
      title: "some product",
        description: "some product",
        price: 1234,
        thumbnail: [],
        code: "ABC123",
        stock: 1234,
        category: "some category",
        status: true,
        owner: "admin"
    }

    const result = await this.productRepository.addProduct(newProduct)

    const productById = await this.productRepository.getProductById(result._id)
    assert.ok(productById._id)
  })

  it("Get Products", async () => {
    // this.timeout(5000)
    const newProduct = {
      title: "some product",
        description: "some product",
        price: 1234,
        thumbnail: [],
        code: "ABC123",
        stock: 1234,
        category: "some category",
        status: true,
        owner: "admin"
    }

    await this.productRepository.addProduct(newProduct)

    const result = await this.productRepository.getProducts()
    
    assert.strictEqual(Array.isArray(result.docs), true)
  })

  after((done) => {
    mongoose.connection.close();
    done();
  })
}
)