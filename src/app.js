const express = require("express")

const app = express()
const PORT = 8080
const { router: productsRouter } = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

