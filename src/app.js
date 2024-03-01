const express = require("express")
const exphbs = require("express-handlebars")
const socket = require("socket.io")
const { router: productsRouter, newProductManager } = require("./routes/products.router.js")
const { router: cartsRouter } = require("./routes/carts.router.js")
const viewsRouter = require("./routes/views.router.js")

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

const httpServer = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

const io = socket(httpServer)

io.on("connection", (socket) => {

  console.log("Connected client")
  
  socket.on("newProduct", async (data) => {
    try {
      await newProductManager.addProduct(data)
      socket.emit("success", {message: "Correctly aggregated product"})
      const products = await newProductManager.getProducts()
      socket.emit("products", products)
    } catch (error) {
      socket.emit("error", error.message)
    }
  })

  socket.on("deleteProduct", async (data) => {
    try {
      await newProductManager.deleteProduct(data)
      socket.emit("success", {message: `Product with id: ${data} correctly deleted`})
      const products = await newProductManager.getProducts()
      socket.emit("products", products)
    } catch (error) {
      socket.emit("error", error.message)
    }
  })

  socket.on("disconnect", () => {
    console.log("Diconnected client");
  });
})

