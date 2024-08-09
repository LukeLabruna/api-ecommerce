const express = require("express")
const exphbs = require("express-handlebars")
const Socket = require("./socket/sockets.js")
require("./utils/database.js")
const mainRoutes = require("./routes/main.router.js")
const cookieParser = require("cookie-parser")
const configObj = require("./config/env.config.js")
const { PORT, ENVIRONMENT, BASE_URL } = configObj
const swaggerUiExpress = require("swagger-ui-express")
const specs = require("./config/swagger.config.js") 

const passport = require("passport")
const initializePassport = require("./config/passport.config.js")

const app = express()

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs, {explorer: true}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("*/css", express.static("src/public/css"))
app.use("*/js", express.static("src/public/js"))

app.engine("handlebars", exphbs.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use(passport.initialize())
initializePassport()

app.use(cookieParser())

mainRoutes(app)

const httpServer = app.listen(PORT, () => console.log(`Listening on ${ENVIRONMENT === "development" ? `http://localhost:${PORT}` : BASE_URL}`))

new Socket(httpServer)

