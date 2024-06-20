const socket = require("socket.io")
const MessageModel = require("../models/message.model.js")
const ProductModel = require("../models/product.model.js")
const ProductRepository = require("../repository/productRepository.js")
const productRepository = new ProductRepository

class Socket {
  constructor(httpServer) {
    this.io = socket(httpServer)
    this.initSocketEvents()
  }

  async initSocketEvents() {

    this.io.on("connection", async (socket) => {

      console.log("Connected client")

      const products = await ProductModel.find()
      socket.emit("products", products)

      socket.on("newProduct", async (data) => {
        try {
          await productRepository.addProduct(data)
          socket.emit("success", { message: "Correctly aggregated product" })
          const products = await ProductModel.find()
          socket.emit("products", products)
        } catch (error) {
          socket.emit("error", error.message)
        }
      })

      socket.on("deleteProduct", async (data) => {
        try {
          await productRepository.deleteProduct(data)
          socket.emit("success", { message: `Product with id: ${data} correctly deleted` })
          const products = await ProductModel.find()
          socket.emit("products", products)
        } catch (error) {
          socket.emit("error", error.message)
        }
      })

      socket.on("message", async data => {
        try {
          await MessageModel.create(data)
          const messages = await MessageModel.find()
          socket.emit("message", messages)
        } catch (error) {
          socket.emit("error", error.message)
        }
      })

      socket.on("disconnect", () => {
        console.log("Diconnected client")
      })
    })
  }

}

module.exports = Socket

