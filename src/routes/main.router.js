const productsApiRouter = require("./api/products.api.router.js")
const cartsApiRouter = require("./api/carts.api.router.js")
const userApiRouter = require("./api/user.api.router.js")

const authMiddleware = require("../middleware/authMiddleware.js")
const addLogger = require("../middleware/addLogger.js")
const handleErrors = require("../middleware/handleErrors.js")

const routes = (app) => {
  app.use(authMiddleware)
  app.use(addLogger)
  app.use("/api/products", productsApiRouter)
  app.use("/api/carts", cartsApiRouter)
  app.use("/api/user", userApiRouter)
  app.use(handleErrors)
}

module.exports = routes