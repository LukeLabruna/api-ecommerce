const socket = require("socket.io")
const MessageModel = require("./models/message.model.js");
const { newProductManager } = require("./controllers/ProductManager.js")

const io = (httpServer) => {

  const io = new socket.Server(httpServer)

  io.on("connection", (socket) => {

    console.log("Connected client")

    socket.on("newProduct", async (data) => {
      try {
        await newProductManager.addProduct(data)
        socket.emit("success", { message: "Correctly aggregated product" })
        const products = await newProductManager.getProducts()
        socket.emit("products", products)
      } catch (error) {
        socket.emit("error", error.message)
      }
    })

    socket.on("deleteProduct", async (data) => {
      try {
        await newProductManager.deleteProduct(data)
        socket.emit("success", { message: `Product with id: ${data} correctly deleted` })
        const products = await newProductManager.getProducts()
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
      console.log("Diconnected client");
    });
  })
}

module.exports = io

