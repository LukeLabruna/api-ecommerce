const homeViewsRouter = require("./views/home.views.router.js")
const productsViewsRouter = require("./views/products.views.router.js")
const cartViewsRouter = require("./views/cart.views.router.js")
const realTimeProductsViewsRouter = require("./views/realTimeProducts.views.router.js")
const chatViewsRouter = require("./views/chat.views.router.js")
const productViewsRouter = require("./views/product.views.router.js")
const userViewsRouter = require("./views/user.views.router.js")

const { router: productsApiRouter } = require("./api/products.api.router.js")
const { router: cartsApiRouter } = require("./api/carts.api.router.js")
const userApiRouter = require("./api/user.api.router.js")

const routes = (app) => {
  app.use("/api/products", productsApiRouter)
  app.use("/api/carts", cartsApiRouter)
  app.use("/api/user", userApiRouter)
  app.use("/", homeViewsRouter)
  app.use("/products", productsViewsRouter)
  app.use("/realTimeProducts", realTimeProductsViewsRouter)
  app.use("/chat", chatViewsRouter)
  app.use("/cart", cartViewsRouter)
  app.use("/product", productViewsRouter)
  app.use("/user", userViewsRouter)
}

module.exports = routes