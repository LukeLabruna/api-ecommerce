const supertest = require("supertest")

let chai, expect

const requester = supertest("http://localhost:8080")

describe("Testing app ecommerce", () => {
  before(async () => {
    chai = await import("chai")
    expect = chai.expect
  })

  describe("Testing Products", () => {

    it("Get Products", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products")
      expect(_body.docs).to.be.an("array")
    })

    it("Create Product", async () => {
      const newProduct = {
        title: "super some product",
        description: "super some product",
        price: 1234,
        thumbnail: [],
        code: "SUPERABC123",
        stock: 1234,
        category: "super some category",
        status: true,
        owner: "admin"
      }
      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(newProduct)
      expect(_body.status).to.be.equal("success")
    })
  })

})