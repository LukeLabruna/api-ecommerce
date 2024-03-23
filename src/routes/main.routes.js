const productsViewsRouter = require("./views/products.views.router.js")
const cartViewsRouter = require("./views/cart.views.js")
const realTimeProductsViewsRouter = require("./views/realTimeProducts.views.js")
const chatViewsRouter = require("./views/chat.views.js")
const productViewsRouter = require("./views/product.views.js")

const { router: productsApiRouter } = require("./api/products.api.router.js")
const { router: cartsApiRouter } = require("./api/carts.api.router.js")

const routes = (app) => {
  app.use("/api/products", productsApiRouter)
  app.use("/api/carts", cartsApiRouter)
  app.use("/products", productsViewsRouter)
  app.use("/realTimeProducts", realTimeProductsViewsRouter)
  app.use("/chat", chatViewsRouter)
  app.use("/cart", cartViewsRouter)
  app.use("/product", productViewsRouter)
}

module.exports = routes